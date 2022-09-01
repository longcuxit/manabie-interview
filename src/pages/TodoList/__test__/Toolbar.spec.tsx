import { act, fireEvent, render, within } from "@testing-library/react";
import { TodoModel, TodoStatus } from "models/Todo";

import { useTodoList } from "store/TodoList";
import { usePushAskConfirm } from "components/AsyncRender";
import { usePushLoader } from "components/Loader";
import { useTodoFilter } from "../Store.filter";

import TodoToolbar from "../Toolbar";
import { fakeTodo } from "models/Todo.mock";

jest.mock("../Store.filter", () => ({ useTodoFilter: jest.fn() }));
jest.mock("store/TodoList", () => ({ useTodoList: jest.fn() }));
jest.mock("components/AsyncRender", () => ({ usePushAskConfirm: jest.fn() }));
jest.mock("components/Loader", () => ({
  usePushLoader: jest.fn(),
  withLoader: (Com: any) => Com,
}));

const mockuseTodoList = useTodoList as jest.Mock;
const mockUsePushAskConfirm = usePushAskConfirm as jest.Mock;
const mockUsePushLoader = usePushLoader as jest.Mock;
const mockUseTodoFilter = useTodoFilter as jest.Mock;

const mapTodos = new Map<string, TodoModel>();
Array.from({ length: 3 }, (_, i) => {
  const todo = fakeTodo({
    content: `Content-${i}`,
    status: i % 2 ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
  });
  mapTodos.set(todo.id, todo);
});

describe("pages/TodoList/ToolBar: ", () => {
  const pushLoader = jest.fn();
  const updateStatus = jest.fn();
  const showConfirm = jest.fn();
  const clearAll = jest.fn();
  const filterStatus = jest.fn();
  const filterKeyword = jest.fn();
  const toggleAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTodoFilter.mockReturnValue([
      { status: "ALL", keyword: "" },
      { status: filterStatus, keyword: filterKeyword },
    ]);
    mockUsePushLoader.mockReturnValue(pushLoader);
    mockuseTodoList.mockReturnValue([
      { todos: mapTodos, countActive: 1 },
      { updateStatus, clearAll, toggleAll },
    ]);
    mockUsePushAskConfirm.mockReturnValue(showConfirm);
  });

  describe("filter keyword: ", () => {
    it("should focus input when click focus button", () => {
      const { getByRole } = render(<TodoToolbar />);
      const input = within(getByRole("searchbox")).getByRole("textbox");

      fireEvent.click(getByRole("search"));

      expect(input).toHaveFocus();
    });

    it("should filter when change value", () => {
      const { getByRole } = render(<TodoToolbar />);
      const input = within(getByRole("searchbox")).getByRole("textbox");

      fireEvent.change(input, { target: { value: "Keyword" } });

      expect(filterKeyword).toBeCalledWith("Keyword");
    });

    it("should show clear button & reset value", () => {
      mockUseTodoFilter.mockReturnValue([
        { status: "ALL", keyword: "Keyword" },
        { status: filterStatus, keyword: filterKeyword },
      ]);
      const { getByRole } = render(<TodoToolbar />);
      const searchBox = within(getByRole("searchbox"));
      const input = searchBox.getByRole("textbox") as HTMLInputElement;
      const clearBtn = searchBox.getByRole("deletion");

      input.value = "Keyword";
      fireEvent.change(input, { target: { value: "Keyword" } });

      expect(clearBtn).toBeInTheDocument();
      fireEvent.click(clearBtn);

      expect(input.value).toBe("");
    });
  });

  describe("toggle all", () => {
    it("should show checked & complete all todos", () => {
      mockuseTodoList.mockReturnValue([
        { todos: mapTodos, countActive: 0 },
        { toggleAll },
      ]);

      const { getByRole } = render(<TodoToolbar />);

      fireEvent.click(getByRole("checkbox"));

      expect(toggleAll).toBeCalledWith(true);
    });

    it("should show unChecked & active all todos", () => {
      mockuseTodoList.mockReturnValue([
        { todos: mapTodos, countActive: 3 },
        { toggleAll },
      ]);

      const { getByRole } = render(<TodoToolbar />);

      fireEvent.click(getByRole("checkbox"));

      expect(toggleAll).toBeCalledWith(false);
    });
  });

  describe("delete all ", () => {
    it("should cancel delete", async () => {
      showConfirm.mockResolvedValue(false);

      const { getByRole } = render(<TodoToolbar />);

      await act(async () => {
        fireEvent.click(getByRole("clear"));
      });

      expect(showConfirm).toBeCalled();
      expect(pushLoader).not.toBeCalled();
      expect(clearAll).not.toBeCalled();
    });

    it("should accept delete", async () => {
      showConfirm.mockResolvedValue(true);

      const { getByRole } = render(<TodoToolbar />);

      await act(async () => {
        fireEvent.click(getByRole("clear"));
      });

      expect(showConfirm).toBeCalled();
      expect(pushLoader).toBeCalled();
      expect(clearAll).toBeCalled();
    });
  });

  it("filter status", () => {
    const { getByRole } = render(<TodoToolbar />);

    fireEvent.mouseDown(getByRole("button", { expanded: false }));
    const listbox = within(getByRole("listbox"));
    fireEvent.click(listbox.getByText("ACTIVE"));

    expect(filterStatus).toBeCalledWith("ACTIVE");
  });
});
