import { Subscriber } from "../Subscriber";

describe("utils/store/Subscriber:", () => {
  const createSubscriber = () =>
    new Subscriber(0, ({ set }) => () => ({ add() {} }));

  it("should create action", () => {
    const subscriber = new Subscriber(0, () => 1);

    expect(subscriber.action).toBe(1);
  });

  it("should api getter work well", () => {
    const subscriber = new Subscriber(0, () => 1);

    expect(subscriber.value).toBe(0);
    expect(subscriber.api.get()).toBe(0);
  });

  it("should api setter work well", () => {
    const subscriber = new Subscriber(0, () => 1);

    subscriber.api.set(10);

    expect(subscriber.value).toBe(10);

    subscriber.api.set((old) => {
      expect(old).toBe(10);
      return 11;
    });

    expect(subscriber.value).toBe(11);
  });

  it("should api partial setter work well", () => {
    const subscriber = new Subscriber({ a: 0, b: 1 }, () => 1);

    expect(subscriber.value).toEqual({ a: 0, b: 1 });

    subscriber.api.partial({ a: 1 });

    expect(subscriber.value).toEqual({ a: 1, b: 1 });

    subscriber.api.partial((old) => {
      expect(old).toEqual({ a: 1, b: 1 });
      return { b: 2 };
    });

    expect(subscriber.value).toEqual({ a: 1, b: 2 });
  });

  it("should api partial skip setter when shallow equal", () => {
    const subscriber = new Subscriber({ a: 0, b: 1 }, () => 1);
    const mockListen = jest.fn();
    subscriber.addListen(mockListen);
    expect(subscriber.value).toEqual({ a: 0, b: 1 });

    subscriber.api.partial({ a: 0 });
    expect(mockListen).not.toBeCalled();
  });
});
