import { fireEvent, screen, act } from "@testing-library/react";
import { renderHook } from "utils/testting";

import { AsyncConfirmProps, usePushConfirm } from "../Confirm";
import { AsyncRenderContainer } from "../Container";

describe("components/AsyncRender/Confirm:", () => {
  const showTestConfirm = (props: AsyncConfirmProps) => {
    const { result } = renderHook(usePushConfirm, {
      wrapper: ({ children }) => (
        <AsyncRenderContainer>{children}</AsyncRenderContainer>
      ),
    });

    let promise!: Promise<boolean>;
    act(() => {
      promise = result.current(props);
    });
    return promise;
  };

  it("should show title", async () => {
    showTestConfirm({ title: "titleConfirm" });

    expect(screen.getByText("titleConfirm")).toBeInTheDocument();
  });

  it("should show message", async () => {
    showTestConfirm({ message: "messageConfirm" });

    expect(screen.getByText("messageConfirm")).toBeInTheDocument();
  });

  it("should changed cancel", async () => {
    const promise = showTestConfirm({ cancel: "cancelText" });

    expect(screen.getByText("cancelText")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText("cancelText"));
    });

    expect(await promise).toBe(false);
  });

  it("should changed accept", async () => {
    const promise = showTestConfirm({ accept: "acceptText" });

    expect(screen.getByText("acceptText")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText("acceptText"));
    });

    expect(await promise).toBe(true);
  });
});
