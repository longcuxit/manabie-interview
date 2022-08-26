import { Completer } from "utils/Completer";

describe("utils/Completer:", () => {
  it("should resolve", () => {
    const completer = new Completer();
    expect(completer.completed).toBe(false);
    completer.resolve();
    expect(completer.completed).toBe(true);
  });

  it("should resolve value", () => {
    const completer = new Completer<boolean>();
    expect(completer.completed).toBe(false);
    expect(completer).resolves.toBe(true);
    completer.resolve(true);
  });

  it("should reject", () => {
    const completer = new Completer();
    expect(completer.completed).toBe(false);
    expect(completer.rejected).toBe(false);
    completer.reject();
    expect(completer.completed).toBe(true);
    expect(completer.rejected).toBe(true);
  });

  it("should throw error", () => {
    const completer = new Completer();
    completer.resolve();
    expect(completer.resolve).toThrowError();
  });
});
