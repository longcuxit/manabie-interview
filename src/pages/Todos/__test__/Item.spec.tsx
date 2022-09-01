import { act, fireEvent, queryByRole, render } from "@testing-library/react";
import { TodoStatus } from "models/Todo";
import { fakeTodo } from "models/Todo.mock";
import Item from "../Item";
import { useTodoActions } from "store/Todos";
import { usePushAskConfirm } from "components/AsyncRender";
import { useLoading } from "components/Loader";
import TodoForm from "../Form";

jest.mock("store/Todos", () => ({ useTodoActions: jest.fn() }));
jest.mock("components/AsyncRender", () => ({ usePushAskConfirm: jest.fn() }));
jest.mock("components/Loader", () => ({
  useLoading: jest.fn(),
  withLoader: (Com: any) => Com,
}));
jest.mock("../Form", () => jest.fn());

const todo = fakeTodo({ content: "Fix content", status: TodoStatus.ACTIVE });

const mockUseTodoActions = useTodoActions as jest.Mock;
const mockUseAsyncConfirm = usePushAskConfirm as jest.Mock;
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
      <form role="form">
        <button />
      </form>
    );
    mockUseLoading.mockReturnValue([false, pushLoader]);
    mockUseTodoActions.mockReturnValue({ updateStatus, remove, updateContent });
    mockUseAsyncConfirm.mockReturnValue(showConfirm);
  });

  it("should show spinner loading", () => {
    mockUseLoading.mockReturnValue([true]);

    const { getByRole } = render(<Item item={todo} />);

    expect(getByRole("progressbar")).toBeInTheDocument();
  });

  it("should update status", () => {
    mockUseLoading.mockReturnValue([true, pushLoader]);

    const { getByRole } = render(<Item item={todo} />);

    fireEvent.click(getByRole("checkbox"));

    expect(pushLoader).toBeCalledTimes(1);
    expect(updateStatus).toBeCalledTimes(1);
  });

  it("should show confirm % cancel delete", async () => {
    showConfirm.mockResolvedValue(undefined);

    const { getByRole } = render(<Item item={todo} />);

    fireEvent.click(getByRole("deletion"));

    expect(showConfirm).toBeCalled();
    expect(pushLoader).toBeCalled();
    expect(remove).not.toBeCalled();
  });

  it("should show confirm % accept delete", async () => {
    showConfirm.mockResolvedValue(true);

    const { getByRole } = render(<Item item={todo} />);

    await act(async () => {
      fireEvent.click(getByRole("deletion"));
    });

    expect(showConfirm).toBeCalled();
    expect(pushLoader).toBeCalled();
    expect(remove).toBeCalled();
  });

  describe("edit mode: ", () => {
    it("should open on double click", () => {
      const { getByRole } = render(<Item item={todo} />);

      act(() => {
        fireEvent.dblClick(getByRole("article"));
      });

      expect(mockTodoForm.mock.lastCall[0].defaultValue).toBe(todo.content);
      expect(getByRole("form")).toBeInTheDocument();
    });

    it("should edit content", async () => {
      const { getByRole, queryByRole } = render(<Item item={todo} />);

      act(() => {
        fireEvent.dblClick(getByRole("article"));
      });

      expect(mockTodoForm).toBeCalled();

      await act(async () => {
        await mockTodoForm.mock.lastCall[0].onSubmit("new content");
      });

      expect(updateContent).toBeCalledWith(todo.id, "new content");
      expect(queryByRole("form")).toBeNull();
    });

    it("should close on blur outside", async () => {
      const { getByRole, queryByRole } = render(<Item item={todo} />);

      act(() => {
        fireEvent.dblClick(getByRole("article"));
      });

      expect(mockTodoForm).toBeCalled();

      await act(async () => {
        await mockTodoForm.mock.lastCall[0].onBlur({});
      });

      expect(queryByRole("form")).not.toBeInTheDocument();
    });

    it("should skip close on blur inside", async () => {
      const { getByRole, queryByRole } = render(<Item item={todo} />);

      act(() => {
        fireEvent.dblClick(getByRole("article"));
      });

      expect(mockTodoForm).toBeCalled();

      await act(async () => {
        await mockTodoForm.mock.calls[0][0].onBlur({
          currentTarget: getByRole("form"),
          relatedTarget: getByRole("button"),
        });
      });

      expect(queryByRole("form")).toBeInTheDocument();
    });
  });
});
