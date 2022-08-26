import {
  fireEvent,
  render,
  screen,
  act,
  renderHook,
} from "@testing-library/react";
import { AsyncConfirmProps, useAsyncConfirm } from "../AsyncConfirm";
import { AsyncModal } from "../AsyncModal";

describe("components/AsyncModal:", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation((call: any) => (call(), 1));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const showTestConfirm = (props: AsyncConfirmProps) => {
    const { result } = renderHook(useAsyncConfirm, {
      wrapper: ({ children }) => <AsyncModal>{children}</AsyncModal>,
    });

    let promise!: Promise<void | true>;
    act(() => {
      promise = result.current(props);
    });
    return promise;
  };

  it("AsyncConfirm should show title", async () => {
    showTestConfirm({ title: "titleConfirm" });

    expect(screen.getByText("titleConfirm")).toBeInTheDocument();
  });

  it("AsyncConfirm should show message", async () => {
    showTestConfirm({ message: "messageConfirm" });

    expect(screen.getByText("messageConfirm")).toBeInTheDocument();
  });

  it("AsyncConfirm should changed cancel", async () => {
    const promise = showTestConfirm({ cancel: "cancelText" });

    expect(screen.getByText("cancelText")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText("cancelText"));
      await promise;
    });

    expect(await promise).toBe(undefined);
  });

  it("AsyncConfirm should changed accept", async () => {
    const promise = showTestConfirm({ accept: "acceptText" });

    expect(screen.getByText("acceptText")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText("acceptText"));
      await promise;
    });

    expect(await promise).toBe(true);
  });
});
