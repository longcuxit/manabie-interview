import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { usePushAsyncModal, AsyncModal } from "../AsyncModal";

describe("components/AsyncModal:", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation((call: any) => (call(), 1));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should show modals", async () => {
    const { result } = renderHook(usePushAsyncModal, {
      wrapper: ({ children }) => <AsyncModal>{children}</AsyncModal>,
    });

    act(() => {
      result.current((pop) => <button onClick={pop}>Modal1</button>);
    });

    expect(screen.getByText("Modal1")).toBeInTheDocument();
    expect(screen.queryAllByRole("dialog").length).toBe(1);

    await act(async () => {
      fireEvent.click(screen.getByText("Modal1"));
    });

    expect(screen.queryAllByRole("dialog").length).toBe(0);

    act(() => {
      result.current((pop) => (
        <button onClick={pop} data-testid="Modal2">
          Modal2
        </button>
      ));
    });

    act(() => {
      result.current((pop) => <button onClick={pop}>Modal3</button>);
    });

    expect(screen.queryAllByRole("dialog").length).toBe(2);

    await act(async () => {
      fireEvent.click(screen.getByTestId("Modal2"));
    });

    expect(screen.queryAllByRole("dialog").length).toBe(1);

    await act(async () => {
      fireEvent.click(screen.getByRole("dialog"));
    });

    expect(screen.queryAllByRole("dialog").length).toBe(0);
  });
});
