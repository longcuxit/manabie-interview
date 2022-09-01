enum CompleterStatus {
  running,
  resolved,
  rejected,
}

export interface Completer<T = void> {
  readonly completed: boolean;
  readonly rejected: boolean;
  readonly resolve: (value: T | PromiseLike<T>) => void;
  readonly reject: (error?: any) => void;
}

export class Completer<T = void> extends Promise<T> {
  constructor() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (error?: any) => void;

    super((next, error) => {
      resolve = next;
      reject = error;
    });

    let status = CompleterStatus.running;

    const checkBadStack = () => {
      if (status) {
        throw Error("Completer already completed!");
      }
    };

    Object.defineProperties(this, {
      completed: { get: () => Boolean(status) },
      rejected: { get: () => status === CompleterStatus.rejected },
      resolve: {
        value(value: T | PromiseLike<T>) {
          checkBadStack();
          status = CompleterStatus.resolved;
          resolve(value);
        },
        writable: false,
      },
      reject: {
        value(error: any) {
          if (error) checkBadStack();
          if (status) return;
          status = CompleterStatus.rejected;
          reject(error);
        },
        writable: false,
      },
    });
  }

  static get [Symbol.species]() {
    return Promise;
  }

  get [Symbol.toStringTag]() {
    return "Completer";
  }

  static listen<T>(promise: Promise<T>) {
    const completer = new Completer<T>();

    promise.then(
      (value) => completer.completed || completer.resolve(value),
      (error) => completer.completed || completer.reject(error)
    );

    return completer;
  }

  static timeout<T = void>(time: number, value?: T | PromiseLike<T>) {
    const completer = new Completer<T>();
    const timeout = setTimeout(() => completer.resolve(value!), time);
    const unTimeout = () => clearTimeout(timeout);
    completer.then(unTimeout, unTimeout);
    return completer;
  }

  static frame<T = void>(skipFrame = 0, value?: T | PromiseLike<T>) {
    const completer = new Completer<T>();
    skipFrame++;
    let frameId: number;
    const run = () => {
      if (!skipFrame--) return completer.resolve(value!);
      frameId = requestAnimationFrame(run);
    };
    run();

    const cancelFrame = () => cancelAnimationFrame(frameId);
    completer.then(cancelFrame, cancelFrame);

    return completer;
  }
}
