import { act, fireEvent, render } from "@testing-library/react";
import { TodoModel, TodoStatus } from "models/Todo";
import Item from "../Item";

import { useTodos } from "store/Todos";
import { useAsyncConfirm } from "components/AsyncModal";
import { usePushLoader } from "components/Loader";
import { useTodoFilter } from "../Store.filter";
import { PartialCheckbox } from "components/PartialCheckbox";

import TodoToolbar from "../Toolbar";
import { fakeTodo } from "utils/testing";

jest.mock("../Store.filter", () => ({ useTodoFilter: jest.fn() }));
jest.mock("store/Todos", () => ({ useTodos: jest.fn() }));
jest.mock("components/AsyncModal", () => ({ useAsyncConfirm: jest.fn() }));
jest.mock("components/PartialCheckbox", () => ({
  PartialCheckbox: jest.fn(() => <>PartialCheckbox</>),
}));
jest.mock("components/Loader", () => ({
  usePushLoader: jest.fn(),
  withLoader: (Com: any) => Com,
}));

const mockUseTodos = useTodos as jest.Mock;
const mockUseAsyncConfirm = useAsyncConfirm as jest.Mock;
const mockUsePushLoader = usePushLoader as jest.Mock;
const mockUseTodoFilter = useTodoFilter as jest.Mock;
const mockPartialCheckbox = PartialCheckbox as jest.Mock;

const mapTodos = new Map<string, TodoModel>();
Array.from({ length: 3 }, (_, i) => {
  const todo = fakeTodo({
    content: `Content-${i}`,
    status: i % 2 ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
  });
  mapTodos.set(todo.id, todo);
});

describe("pages/Todos/ToolBar: ", () => {
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
    mockUseTodos.mockReturnValue([
      { todos: mapTodos, countActive: 1 },
      { updateStatus, clearAll, toggleAll },
    ]);
    mockUseAsyncConfirm.mockReturnValue(showConfirm);
  });

  it("should match snapshot", () => {
    const { container } = render(<TodoToolbar />);

    expect(container).toMatchSnapshot();
  });

  describe("filter keyword: ", () => {
    it("should focus input when click focus button", async () => {
      const { container } = render(<TodoToolbar />);

      const focusBtn = container.querySelector(".btn-focus")!;
      const input = container.querySelector(
        ".form-control"
      ) as HTMLInputElement;
      const focus = (input.focus = jest.fn());

      fireEvent.click(focusBtn);

      expect(focus).toBeCalledTimes(1);
    });

    it("should filter when change value", async () => {
      const { container } = render(<TodoToolbar />);

      const input = container.querySelector(
        ".form-control"
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "Keyword" } });

      expect(filterKeyword).toBeCalledWith("Keyword");
    });

    it("should show clear button & reset value", async () => {
      mockUseTodoFilter.mockReturnValue([
        { status: "ALL", keyword: "Keyword" },
        { status: filterStatus, keyword: filterKeyword },
      ]);

      const { container } = render(<TodoToolbar />);

      const input = container.querySelector(
        ".form-control"
      ) as HTMLInputElement;
      const clearBtn = container.querySelector(".btn-clear")!;

      expect(clearBtn).toBeInTheDocument();

      input.value = "Keyword";

      fireEvent.click(clearBtn);

      expect(input.value).toBe("");
    });
  });

  describe("toggle all", () => {
    it("should show partial", () => {
      mockUseTodos.mockReturnValue([{ todos: mapTodos, countActive: 1 }]);

      render(<TodoToolbar />);

      expect(mockPartialCheckbox).toBeCalled();

      const props = mockPartialCheckbox.mock.calls[0][0];
      expect(props.checked).toBe(undefined);
    });

    it("should show checked & complete all todos", () => {
      mockUseTodos.mockReturnValue([
        { todos: mapTodos, countActive: 0 },
        { toggleAll },
      ]);

      render(<TodoToolbar />);

      expect(mockPartialCheckbox).toBeCalled();

      const props = mockPartialCheckbox.mock.calls[0][0];
      expect(props.checked).toBe(true);

      props.onChange({ target: { checked: false } });
      expect(toggleAll).toBeCalledWith(true);
    });

    it("should show unChecked & active all todos", () => {
      mockUseTodos.mockReturnValue([
        { todos: mapTodos, countActive: 3 },
        { toggleAll },
      ]);

      render(<TodoToolbar />);

      expect(mockPartialCheckbox).toBeCalled();

      const props = mockPartialCheckbox.mock.calls[0][0];
      expect(props.checked).toBe(false);

      props.onChange({ target: { checked: true } });
      expect(toggleAll).toBeCalledWith(false);
    });
  });

  describe("delete all ", () => {
    it("should show confirm % cancel delete", async () => {
      showConfirm.mockResolvedValue(undefined);

      const { container } = render(<TodoToolbar />);

      await act(async () => {
        fireEvent.click(container.querySelector(".btn-danger")!);
      });

      expect(showConfirm).toBeCalled();
      expect(pushLoader).not.toBeCalled();
      expect(clearAll).not.toBeCalled();
    });

    it("should show confirm % accept delete", async () => {
      showConfirm.mockResolvedValue(true);

      const { container } = render(<TodoToolbar />);

      await act(async () => {
        fireEvent.click(container.querySelector(".btn-danger")!);
      });

      expect(showConfirm).toBeCalled();
      expect(pushLoader).toBeCalled();
      expect(clearAll).toBeCalled();
    });

    it("should ignore show confirm", async () => {
      const { container, rerender } = render(
        <>
          <TodoToolbar />
          {false}
        </>
      );

      await act(async () => {
        fireEvent.click(container.querySelector(".btn-danger")!);
      });

      expect(showConfirm).toBeCalled();

      rerender(
        <>
          <TodoToolbar />
          {showConfirm.mock.calls[0][0].footer}
        </>
      );

      const askMe = container.querySelector(".flex-fill .form-check-input")!;

      expect(askMe).toBeInTheDocument();
      expect(localStorage.getItem("DeleteAllItems")).toBe("true");
      fireEvent.click(askMe);
      expect(localStorage.getItem("DeleteAllItems")).toBe("false");
    });

    it("should don't show confirm % accept delete", async () => {
      showConfirm.mockResolvedValue(true);

      const { container } = render(<TodoToolbar />);

      await act(async () => {
        fireEvent.click(container.querySelector(".btn-danger")!);
      });

      expect(showConfirm).not.toBeCalled();
      expect(pushLoader).toBeCalled();
      expect(clearAll).toBeCalled();
    });
  });

  it("filter status", () => {
    const { container } = render(<TodoToolbar />);

    fireEvent.click(container.querySelector(".dropdown-toggle")!);

    expect(container.querySelector(".dropdown-menu")).toBeInTheDocument();

    fireEvent.click(container.querySelectorAll(".dropdown-item")[1]);

    expect(filterStatus).toBeCalledWith("ACTIVE");
  });
});
