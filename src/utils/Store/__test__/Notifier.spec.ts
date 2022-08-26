import { Notifier, ValueChanged } from "../Notifier";

describe("utils/store/Notifier:", () => {
  it("should have listener", () => {
    const notifier = new Notifier();

    expect(notifier.hasListen).toBe(false);

    notifier.addListen(() => {});

    expect(notifier.hasListen).toBe(true);
  });

  it("should remove listener", () => {
    const notifier = new Notifier();

    const removeListen = notifier.addListen(() => {});

    expect(notifier.hasListen).toBe(true);

    removeListen();

    expect(notifier.hasListen).toBe(false);
  });
});

describe("utils/store/ValueChanged:", () => {
  it("should init with value", () => {
    const valueChange = new ValueChanged(1);

    expect(valueChange.value).toBe(1);
  });

  it("should change value", () => {
    const valueChange = new ValueChanged(1);

    expect(valueChange.value).toBe(1);

    valueChange.value = 2;

    expect(valueChange.value).toBe(2);
  });

  it("should trigger listen on value change", () => {
    const valueChange = new ValueChanged(1);
    const mockFn = jest.fn();
    valueChange.addListen(mockFn);

    expect(valueChange.value).toBe(1);

    valueChange.value = 2;

    expect(valueChange.value).toBe(2);
    expect(mockFn).toBeCalledTimes(1);
  });

  it("should don't trigger listen when set newValue === oldValue", () => {
    const valueChange = new ValueChanged(1);
    const mockFn = jest.fn();
    valueChange.addListen(mockFn);

    expect(valueChange.value).toBe(1);

    valueChange.value = 1;

    expect(mockFn).toBeCalledTimes(0);
  });
});
