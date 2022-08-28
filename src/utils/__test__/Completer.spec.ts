import { Completer } from "utils/Completer";

describe("utils/Completer:", () => {
  it("should resolve", () => {
    const completer = new Completer<boolean>();
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
    expect(completer.reject).toThrowError();
  });
});
