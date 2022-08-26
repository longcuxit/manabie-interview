enum CompleterStatus {
  running,
  resolved,
  rejected,
}

export interface Completer<T = void> extends Promise<T> {
  readonly completed: boolean;
  readonly rejected: boolean;
  readonly resolve: (value: T | PromiseLike<T>) => void;
  readonly reject: (error?: any) => void;
}

export class Completer<T = void> {
  constructor() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (error?: any) => void;

    const promise = new Promise<T>((next, error) => {
      resolve = next;
      reject = error;
    }) as Completer<T>;

    let status = CompleterStatus.running;

    const checkBadStack = () => {
      if (status) {
        throw Error("Completer already completed!");
      }
    };

    Object.defineProperties(promise, {
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
          checkBadStack();
          status = CompleterStatus.rejected;
          reject(error);
        },
        writable: false,
      },
    });

    return promise;
  }
}
