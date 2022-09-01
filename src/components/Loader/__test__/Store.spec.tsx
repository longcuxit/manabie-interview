import { act } from "@testing-library/react";
import { Fragment } from "react";

import { Completer } from "utils";
import { renderHook } from "utils/testting";
import { useLoading, LoaderSubscriber } from "../Store";

describe("components/Loader:", () => {
  it("should push and change loading state", async () => {
    const { result } = renderHook(useLoading);

    const completer = new Completer();
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](completer);
    });

    expect(result.current[0]).toBe(true);

    await act(async () => completer.resolve());

    expect(result.current[0]).toBe(false);
  });

  it("should push multiply promise", async () => {
    const { result } = renderHook(useLoading);

    const completers: Completer[] = [];
    expect(result.current[0]).toBe(false);

    act(() => {
      let count = 10;
      while (count--) {
        const completer = new Completer();
        completers.push(completer);
        result.current[1](completer);
        // random done promise
        if (Math.random() > 0.5) completers.pop()!.resolve();
      }
    });

    expect(result.current[0]).toBe(true);

    await act(async () => {
      while (completers.length) completers.pop()!.resolve();
    });

    expect(result.current[0]).toBe(false);
  });

  it("loading from subscriber", async () => {
    const stateChanged = jest.fn();

    const { result } = renderHook(useLoading, {
      wrapper: ({ children }) => (
        <Fragment>
          {children}
          <LoaderSubscriber children={(loading) => stateChanged(loading)} />
        </Fragment>
      ),
    });

    const completer = new Completer();

    expect(stateChanged).lastCalledWith(false);

    act(() => {
      result.current[1](completer);
    });

    expect(stateChanged).lastCalledWith(true);

    await act(async () => {
      completer.resolve();
    });

    expect(stateChanged).lastCalledWith(false);
  });
});
