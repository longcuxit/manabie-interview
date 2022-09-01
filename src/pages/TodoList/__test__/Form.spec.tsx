import { fireEvent, render, act } from "@testing-library/react";

import TodoForm from "../Form";

import { useLoading } from "components/Loader";

jest.mock("components/Loader", () => ({
  useLoading: jest.fn(),
  withLoader: (Com: any) => Com,
}));

const mockUseLoading = useLoading as jest.Mock;

describe("pages/Todos/Form:", () => {
  const pushLoader = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoading.mockReturnValue([false, pushLoader]);
    pushLoader.mockImplementation((value) => value);
    onSubmit.mockReturnValue(Promise.resolve());
  });

  it("should show loading", () => {
    mockUseLoading.mockReturnValue([true, pushLoader]);
    const { getByRole } = render(<TodoForm onSubmit={onSubmit} />);

    expect(getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show focus button & focus to input", () => {
    const { getByRole } = render(<TodoForm onSubmit={onSubmit} />);

    const focusBtn = getByRole("button");
    expect(focusBtn).toBeInTheDocument();

    const input = getByRole("textbox") as HTMLInputElement;
    const focus = (input.focus = jest.fn());
    fireEvent.click(focusBtn, { currentTarget: focusBtn });

    expect(focus).toBeCalledTimes(1);
  });

  it("should show send button", () => {
    const { getByRole } = render(<TodoForm onSubmit={onSubmit} />);

    const input = getByRole("textbox");
    fireEvent.change(input, { target: { value: "Message" } });

    expect(getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("should skip submit when don't have value", async () => {
    const { getByRole } = render(<TodoForm onSubmit={onSubmit} />);

    fireEvent.submit(getByRole("form"));

    expect(pushLoader).not.toBeCalled();
    expect(onSubmit).not.toBeCalled();
  });

  it("should submit form", async () => {
    const { getByRole } = render(<TodoForm onSubmit={onSubmit} />);

    await act(async () => {
      fireEvent.change(getByRole("textbox"), { target: { value: "Message" } });
      fireEvent.submit(getByRole("form"));
    });

    expect(pushLoader).toBeCalledTimes(1);
    expect(onSubmit).toBeCalledWith("Message");

    expect(getByRole("button")).not.toHaveAttribute("type", "submit");
  });
});
