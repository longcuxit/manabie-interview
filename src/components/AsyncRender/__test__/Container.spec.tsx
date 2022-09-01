import { fireEvent, act } from "@testing-library/react";

import { renderHook } from "utils/testting";
import "utils/polyfill";

import { AsyncRenderContainer, usePushRender } from "../Container";
import { Completer } from "utils";
import { Fragment } from "react";

describe("components/AsyncRender:", () => {
  it("should show and hide render", async () => {
    const { result, queryAllByRole } = renderHook(usePushRender, {
      wrapper: ({ children }) => (
        <AsyncRenderContainer>{children}</AsyncRenderContainer>
      ),
    });

    const render = jest.fn((open, pop, exited) => <div role="dialog" />);

    let waiting!: Promise<any>;

    act(() => {
      waiting = result.current(render);
    });

    expect(render).toHaveBeenCalled();
    expect(render.mock.lastCall[0]).toBe(true);
    expect(queryAllByRole("dialog")).toHaveLength(1);

    await act(async () => {
      render.mock.lastCall[1](true);
    });

    expect(render.mock.lastCall[0]).toBe(false);
    expect(waiting).resolves.toBe(true);
    expect(queryAllByRole("dialog")).toHaveLength(1);

    act(() => {
      render.mock.lastCall[2]();
    });

    expect(queryAllByRole("dialog")).toHaveLength(0);
  });

  it("should show and hide multiply renders", async () => {
    const { result, queryAllByRole, getByText } = renderHook(usePushRender, {
      wrapper: ({ children }) => (
        <AsyncRenderContainer>{children}</AsyncRenderContainer>
      ),
    });

    const renders = Array.from({ length: 3 }, (_, i) =>
      jest.fn((open, pop, exited) => <div role="dialog" data-testid={i} />)
    );

    renders.forEach((render, i) => {
      act(() => {
        result.current(render);
      });

      expect(render).toBeCalled();
      expect(render.mock.lastCall[0]).toBe(true);

      if (i > 0) {
        const args = renders[i - 1].mock.lastCall;
        expect(args[0]).toBe(false);
        act(args[2]);
      }
    });

    expect(queryAllByRole("dialog")).toHaveLength(renders.length);
    await act(async () => {
      for (const render of renders.reverse()) {
        render.mock.lastCall[1]();
        render.mock.lastCall[2]();
      }
    });

    expect(queryAllByRole("dialog")).toHaveLength(0);
  });
});
