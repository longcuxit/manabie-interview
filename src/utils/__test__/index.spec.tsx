import { Completer, createLocalStorage, debounce, mergeVoidFns } from "utils";

import "../axios";

describe("utils/debounce:", () => {
  it("call multi times (2)", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced();
    debounced();
    await Completer.timeout(100);

    expect(fn).toBeCalledTimes(2);
  });

  it("call multi times (3)", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced();
    debounced();
    await Completer.timeout(100);
    debounced();
    debounced();
    debounced();
    await Completer.timeout(100);

    expect(fn).toBeCalledTimes(3);
  });

  it("call with default delay", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn);
    debounced();
    debounced();
    debounced();
    await Completer.timeout(100);
    debounced();
    debounced();
    debounced();
    await Completer.timeout(100);

    expect(fn).toBeCalledTimes(3);
  });
});

describe("utils/localStorage:", () => {
  it("initial default value", () => {
    const storage = createLocalStorage("Storage-test", false);

    expect(storage.get()).toBe(false);
  });

  it("should change value", () => {
    const storage = createLocalStorage("Storage-test", false);
    storage.set(true);
    expect(storage.get()).toBe(true);
  });
});

describe("utils/eachVoidCall:", () => {
  it("should each call functions", () => {
    const calls = [jest.fn(), jest.fn(), jest.fn()];
    mergeVoidFns(...calls)();
    calls.forEach((call) => expect(call).toBeCalledTimes(1));
  });
});
