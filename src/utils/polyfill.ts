declare global {
  interface ObjectConstructor {
    keys<O>(object: O): (keyof O)[];
  }

  interface PromiseConstructor {
    delay(time: number): Promise<void>;
  }
}

Promise.delay = (time) => new Promise((next) => setTimeout(next, time));

export {};
