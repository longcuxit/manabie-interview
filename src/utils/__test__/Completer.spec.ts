import { Completer } from "utils/Completer";

describe("utils/Completer:", () => {
  it("should resolve", () => {
    const completer = new Completer<boolean>();

    expect(completer[Symbol.toStringTag]).toBe("Completer");
    expect(completer.completed).toBe(false);
    expect(completer).resolves.toBe(true);

    completer.resolve(true);

    expect(completer.completed).toBe(true);
    expect(completer.rejected).toBe(false);
    expect(completer).resolves.toBe(true);
  });

  it("should reject", async () => {
    const completer = new Completer();
    expect(completer.completed).toBe(false);
    expect(completer.rejected).toBe(false);

    completer.reject("Error");

    expect(completer.completed).toBe(true);
    expect(completer.rejected).toBe(true);
    expect(completer).rejects.toBe("Error");
  });

  it("should throw error when completed", () => {
    const completer = new Completer<boolean>();
    expect(completer.completed).toBe(false);
    expect(completer.rejected).toBe(false);

    completer.resolve(true);

    expect(completer.completed).toBe(true);
    expect(completer).resolves.toBe(true);

    expect(completer.resolve).toThrowError();
    expect(() => completer.reject(1)).toThrowError();
  });

  it("should delay timeout", async () => {
    const delayTime = (time: number) =>
      new Promise((next) => setTimeout(next, time));

    const completer = Completer.timeout(10, true);
    expect(completer.completed).toBe(false);
    await delayTime(5);
    expect(completer.completed).toBe(false);
    await delayTime(5);
    expect(completer.completed).toBe(true);
    expect(completer).resolves.toBe(true);
  });

  it("should break delay timeout", async () => {
    const delayTime = (time: number) =>
      new Promise((next) => setTimeout(next, time));

    const completer = Completer.timeout(10, true);
    expect(completer.completed).toBe(false);
    await delayTime(5);
    completer.resolve(false);
    expect(completer.completed).toBe(true);
    expect(completer).resolves.toBe(false);
  });

  it("should delay 1 frame", async () => {
    const delayFrame = () => new Promise((next) => requestAnimationFrame(next));

    const completer = Completer.frame();
    expect(completer.completed).toBe(false);
    await delayFrame();
    expect(completer.completed).toBe(true);
  });

  it("should delay 1 frame & skip 1 frame", async () => {
    const delayFrame = () => new Promise((next) => requestAnimationFrame(next));

    const completer = Completer.frame(1, true);
    expect(completer.completed).toBe(false);
    await delayFrame();
    expect(completer.completed).toBe(false);
    await delayFrame();
    expect(completer.completed).toBe(true);
    expect(completer).resolves.toBe(true);
  });

  it("should delay 1 frame & break skip 2 frame", async () => {
    const delayFrame = () => new Promise((next) => requestAnimationFrame(next));

    const completer = Completer.frame(2, true);
    expect(completer.completed).toBe(false);
    await delayFrame();
    expect(completer.completed).toBe(false);
    await Promise.resolve();
    completer.resolve(false);
    expect(completer.completed).toBe(true);
    expect(completer).resolves.toBe(false);
  });

  it("should resolve listen a promise", async () => {
    const completer = Completer.listen(Promise.resolve(true));
    expect(completer.completed).toBe(false);
    await Promise.resolve();
    expect(completer.completed).toBe(true);
    expect(completer).resolves.toBe(true);
  });

  it("should break resolve listen a promise", async () => {
    const delay = new Completer<boolean>();
    const listening = Completer.listen(delay);
    await Promise.resolve();

    expect(delay.completed).toBe(false);
    expect(listening.completed).toBe(false);

    listening.resolve(false);
    expect(delay.completed).toBe(false);
    expect(listening.completed).toBe(true);

    delay.resolve(true);

    expect(delay.completed).toBe(true);
    expect(listening.completed).toBe(true);

    expect(delay).resolves.toBe(true);
    expect(listening).resolves.toBe(false);
  });

  it("should reject listen a promise", async () => {
    const completer = Completer.listen(Promise.reject("rejected"));
    expect(completer.completed).toBe(false);
    await Promise.resolve();
    expect(completer.completed).toBe(true);
    expect(completer).rejects.toBe("rejected");
  });

  it("should break reject listen a promise", async () => {
    const delay = new Completer<boolean>();
    const listening = Completer.listen(delay);
    await Promise.resolve();

    expect(delay.completed).toBe(false);
    expect(listening.completed).toBe(false);

    listening.reject("rejectListen");
    expect(delay.completed).toBe(false);
    expect(listening.completed).toBe(true);

    delay.reject("rejected");

    expect(delay.completed).toBe(true);
    expect(listening.completed).toBe(true);

    expect(listening).rejects.toBe("rejectListen");
    expect(delay).rejects.toBe("rejected");
  });
});
