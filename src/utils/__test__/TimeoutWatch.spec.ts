import "../polyfill";
import { TimeoutWatch } from "utils/TimeoutWatch";
import { Completer } from "utils/Completer";

describe("utils/TimeoutWatch:", () => {
  it("should resolve", async () => {
    const watch = new TimeoutWatch();
    expect(watch.duration).toBe(0);
    expect(watch.running).toBe(false);

    watch.play(100);
    expect(watch.running).toBe(true);

    await Completer.timeout(100);

    expect(watch.running).toBe(false);
    expect(watch.duration).toBe(0);
  });

  it("should pause/resume", async () => {
    const watch = new TimeoutWatch().play(100);

    expect(watch.running).toBe(true);

    await Completer.timeout(10);
    const { duration } = watch;
    expect(duration).toBeLessThan(100);

    watch.pause();

    expect(watch.running).toBe(false);
    expect(watch.duration).toBeLessThanOrEqual(duration);

    watch.play();
    expect(watch.running).toBe(true);

    await Completer.timeout(90);

    expect(watch.running).toBe(false);
    expect(watch.duration).toBe(0);
  });

  it("should force finish", async () => {
    const watch = new TimeoutWatch().play(100);

    expect(watch.running).toBe(true);

    watch.finish();

    expect(watch.running).toBe(false);
    expect(watch.duration).toBe(0);
  });

  it("should duplicate calls", async () => {
    const listen = jest.fn();
    const watch = new TimeoutWatch();
    watch.addListen(listen);

    watch.play(100);
    watch.play();
    expect(listen).toBeCalledTimes(1);

    watch.pause();
    watch.pause();
    expect(listen).toBeCalledTimes(2);

    watch.play();
    watch.play();
    expect(listen).toBeCalledTimes(3);

    watch.finish();
    watch.finish();
    expect(listen).toBeCalledTimes(4);
  });

  it("should reset duration", async () => {
    const watch = new TimeoutWatch().play(100);

    expect(watch.running).toBe(true);
    watch.finish();
    expect(watch.running).toBe(false);
    expect(watch.duration).toBe(0);
  });
});
