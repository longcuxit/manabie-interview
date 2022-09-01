import { render } from "@testing-library/react";
import { TodoModel, TodoStatus } from "models/Todo";

import TodoList from "../List";

import { useTodoActions, useTodoList } from "store/TodoList";
import { useTodoFilter } from "../Store.filter";
import { fakeTodo } from "models/Todo.mock";

jest.mock("store/TodoList", () => ({
  useTodoList: jest.fn(),
  useTodoActions: jest.fn(),
}));
jest.mock("../Store.filter", () => ({ useTodoFilter: jest.fn() }));

const mapTodos = new Map<string, TodoModel>();
Array.from({ length: 3 }, (_, i) => {
  const todo = fakeTodo({
    content: `Content-${i}`,
    status: i % 2 ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
  });
  mapTodos.set(todo.id, todo);
});

const mockUseTodoActions = useTodoActions as jest.Mock;
const mockuseTodoList = useTodoList as jest.Mock;
const mockUseTodoFilter = useTodoFilter as jest.Mock;

describe("pages/Todos/List", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTodoFilter.mockReturnValue([{ status: "ALL", keyword: "" }]);
    mockuseTodoList.mockReturnValue([{ todos: mapTodos }]);
  });

  it("should filter status todos", () => {
    mockUseTodoFilter.mockReturnValue([
      { status: TodoStatus.ACTIVE, keyword: "" },
    ]);
    const { getAllByRole, rerender } = render(<TodoList />);
    expect(getAllByRole("listitem")).toHaveLength(2);

    mockUseTodoFilter.mockReturnValue([
      { status: TodoStatus.COMPLETED, keyword: "" },
    ]);
    rerender(<TodoList />);
    expect(getAllByRole("listitem")).toHaveLength(1);
  });

  it("should filter keyword todos", () => {
    mockUseTodoFilter.mockReturnValue([
      { status: TodoStatus.ACTIVE, keyword: "" },
    ]);
    var { getAllByRole, rerender } = render(<TodoList />);
    expect(getAllByRole("listitem")).toHaveLength(2);

    mockUseTodoFilter.mockReturnValue([
      { status: "ALL", keyword: "content-2" },
    ]);
    rerender(<TodoList />);
    expect(getAllByRole("listitem")).toHaveLength(1);
  });
});
