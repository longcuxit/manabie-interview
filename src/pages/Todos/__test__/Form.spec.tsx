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
  });

  it("should match snapshot", () => {
    const { container } = render(<TodoForm onSubmit={onSubmit} />);
    expect(container).toMatchSnapshot();
  });

  it("should show loading", () => {
    mockUseLoading.mockReturnValue([true, pushLoader]);
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("should show focus button & focus to input", () => {
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const focusBtn = container.querySelector(".btn-focus")!;
    expect(focusBtn).toBeInTheDocument();

    const input = container.querySelector(".form-control") as HTMLInputElement;
    const focus = (input.focus = jest.fn());
    fireEvent.click(focusBtn, { currentTarget: focusBtn });

    expect(focus).toBeCalledTimes(1);
  });

  it("should show send button", async () => {
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const input = container.querySelector(".form-control")!;
    fireEvent.change(input, { target: { value: "Message" } });

    const sendBtn = container.querySelector(".btn-send")!;
    expect(sendBtn).toBeInTheDocument();
  });

  it("should skip submit when don't have value", async () => {
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const form = container.querySelector("form.input-group")!;

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(pushLoader).not.toBeCalled();
    expect(onSubmit).not.toBeCalled();
  });

  it("should submit form", async () => {
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const form = container.querySelector("form.input-group")!;

    const input = container.querySelector(".form-control")!;
    act(() => {
      fireEvent.change(input, { target: { value: "Message" } });
    });

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(pushLoader).toBeCalledTimes(1);
    expect(onSubmit).toBeCalledWith("Message");

    expect(container.querySelector(".btn-focus")).toBeInTheDocument();
  });
});
