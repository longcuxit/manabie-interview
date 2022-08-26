import { act, fireEvent, render } from "@testing-library/react";
import { TodoStatus } from "models/Todo";
import Item from "../Item";

import { useTodoActions } from "store/Todos";
import { useAsyncConfirm } from "components/AsyncModal";
import { useLoading } from "components/Loader";
import { fakeTodo } from "utils/testing";
import TodoForm from "../Form";

jest.mock("store/Todos", () => ({ useTodoActions: jest.fn() }));
jest.mock("components/AsyncModal", () => ({ useAsyncConfirm: jest.fn() }));
jest.mock("components/Loader", () => ({
  useLoading: jest.fn(),
  withLoader: (Com: any) => Com,
}));
jest.mock("../Form", () => jest.fn());

const todo = fakeTodo({ content: "Fix content", status: TodoStatus.ACTIVE });

const mockUseTodoActions = useTodoActions as jest.Mock;
const mockUseAsyncConfirm = useAsyncConfirm as jest.Mock;
const mockUseLoading = useLoading as jest.Mock;
const mockTodoForm = TodoForm as jest.Mock;

describe("pages/Todos/Item", () => {
  const pushLoader = jest.fn();
  const updateStatus = jest.fn();
  const showConfirm = jest.fn();
  const remove = jest.fn();
  const updateContent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockTodoForm.mockReturnValue(
      <div className="todo-form">
        <button />
      </div>
    );
    mockUseLoading.mockReturnValue([false, pushLoader]);
    mockUseTodoActions.mockReturnValue({ updateStatus, remove, updateContent });
    mockUseAsyncConfirm.mockReturnValue(showConfirm);
  });

  it("should match snapshot", () => {
    const { container } = render(<Item item={todo} />);

    expect(container).toMatchSnapshot();
  });

  it("should show spinner loading", () => {
    mockUseLoading.mockReturnValue([true]);

    const { container } = render(<Item item={todo} />);

    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("should update status", () => {
    mockUseLoading.mockReturnValue([true, pushLoader]);

    const { container } = render(<Item item={todo} />);

    fireEvent.click(container.querySelector(".form-check-input")!);

    expect(pushLoader).toBeCalledTimes(1);
    expect(updateStatus).toBeCalledTimes(1);
  });

  it("should show confirm % cancel delete", async () => {
    showConfirm.mockResolvedValue(undefined);

    const { container } = render(<Item item={todo} />);

    await act(async () => {
      fireEvent.click(container.querySelector(".btn-close")!);
    });

    expect(showConfirm).toBeCalled();
    expect(pushLoader).toBeCalled();
    expect(remove).not.toBeCalled();
  });

  it("should show confirm % accept delete", async () => {
    showConfirm.mockResolvedValue(true);

    const { container } = render(<Item item={todo} />);

    await act(async () => {
      fireEvent.click(container.querySelector(".btn-close")!);
    });

    expect(showConfirm).toBeCalled();
    expect(pushLoader).toBeCalled();
    expect(remove).toBeCalled();
  });

  it("should ignore show confirm", async () => {
    const { container, rerender } = render(
      <>
        <Item item={todo} />
        {false}
      </>
    );

    await act(async () => {
      fireEvent.click(container.querySelector(".btn-close")!);
    });

    expect(showConfirm).toBeCalled();

    rerender(
      <>
        <Item item={todo} />
        {showConfirm.mock.calls[0][0].footer}
      </>
    );

    const askMe = container.querySelector(".flex-fill .form-check-input")!;

    expect(askMe).toBeInTheDocument();
    expect(localStorage.getItem("DeleteAnItem")).toBe("true");
    fireEvent.click(askMe);
    expect(localStorage.getItem("DeleteAnItem")).toBe("false");
  });

  it("should don't show confirm % accept delete", async () => {
    showConfirm.mockResolvedValue(true);

    const { container } = render(<Item item={todo} />);

    await act(async () => {
      fireEvent.click(container.querySelector(".btn-close")!);
    });

    expect(showConfirm).not.toBeCalled();
    expect(pushLoader).toBeCalled();
    expect(remove).toBeCalled();
  });

  describe("edit mode: ", () => {
    it("should open on double click", () => {
      const { container } = render(<Item item={todo} />);

      act(() => {
        fireEvent.dblClick(container.querySelector(".list-group-item")!);
      });

      expect(mockTodoForm).toBeCalled();
      expect(mockTodoForm.mock.calls[0][0].defaultValue).toBe(todo.content);
      expect(container.querySelector(".todo-form")).toBeInTheDocument();
    });
  });

  it("should edit content", async () => {
    const { container } = render(<Item item={todo} />);

    act(() => {
      fireEvent.dblClick(container.querySelector(".list-group-item")!);
    });

    expect(mockTodoForm).toBeCalled();

    await act(async () => {
      await mockTodoForm.mock.calls[0][0].onSubmit("new content");
    });

    expect(updateContent).toBeCalledWith(todo.id, "new content");
    expect(container.querySelector(".todo-form")).not.toBeInTheDocument();
  });

  it("should close on blur outside", async () => {
    const { container } = render(<Item item={todo} />);

    act(() => {
      fireEvent.dblClick(container.querySelector(".list-group-item")!);
    });

    expect(mockTodoForm).toBeCalled();

    await act(async () => {
      await mockTodoForm.mock.calls[0][0].onBlur({});
    });

    expect(container.querySelector(".todo-form")).not.toBeInTheDocument();
  });

  it("should skip close on blur inside", async () => {
    const { container } = render(<Item item={todo} />);

    act(() => {
      fireEvent.dblClick(container.querySelector(".list-group-item")!);
    });

    expect(mockTodoForm).toBeCalled();

    const form = container.querySelector(".todo-form")!;
    const button = form.querySelector("button");

    await act(async () => {
      await mockTodoForm.mock.calls[0][0].onBlur({
        currentTarget: form,
        relatedTarget: button,
      });
    });

    expect(container.querySelector(".todo-form")).toBeInTheDocument();
  });
});
