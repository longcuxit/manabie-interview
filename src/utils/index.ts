export * from "./polyfill";
export * from "./Completer";
export * from "./Store";

export function debounce<T, A extends any[] = never>(
  call: (this: T, ...args: A) => void,
  delay = 100
) {
  let timeOut: NodeJS.Timeout;
  let startTime = 0;
  return function (this: T, ...args: A) {
    const currentTime = Date.now();
    if (currentTime - startTime > delay) {
      startTime = currentTime;
      call.apply(this, args);
    } else {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        startTime = Date.now();
        call.apply(this, args);
      }, Math.max(startTime - currentTime + delay, 0));
    }
  };
}

export function createLocalStorage<T>(name: string, initial: T) {
  if (localStorage.getItem(name) === null)
    localStorage.setItem(name, JSON.stringify(initial));

  return {
    get() {
      return JSON.parse(localStorage.getItem(name)!);
    },
    set(value: T) {
      localStorage.setItem(name, JSON.stringify(value));
    },
  };
}
