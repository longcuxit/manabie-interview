import { act, renderHook } from "@testing-library/react";
import { useTodos } from "../Todos";

import Service from "service";
import { TodoStatus } from "models/Todo";
import { fakeTodo } from "utils/testing";

jest.mock("service", () => {
  const fns: Record<string, jest.Mock> = {};
  return {
    __esModule: true,
    default: new Proxy(fns, {
      get: (fns, key: string) => {
        if (!fns[key]) fns[key] = jest.fn();
        return fns[key];
      },
    }),
  };
});

const mockService = Service as Record<keyof typeof Service, jest.Mock>;

const fakeTodos = Array.from({ length: 2 }, (_, i) =>
  fakeTodo({ status: i % 2 ? TodoStatus.ACTIVE : TodoStatus.COMPLETED })
);

describe("stores/Todos:", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation((call: any) => (call(), 1));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fetch todos", async () => {
    const { result } = renderHook(useTodos);

    mockService.getTodos.mockResolvedValueOnce(fakeTodos);

    await act(result.current[1].initialize);

    expect(mockService.getTodos).toBeCalledTimes(1);
    expect(Array.from(result.current[0].todos.values())).toEqual(fakeTodos);
    expect(result.current[0].countActive).toBe(1);
  });

  describe("clear completed items", () => {
    it("should skip from api", async () => {
      const { result } = renderHook(useTodos);

      mockService.clearTodos.mockResolvedValueOnce(false);

      await act(result.current[1].clearAll);

      expect(mockService.clearTodos).toBeCalledWith([fakeTodos[0].id]);
      expect(result.current[0].todos.size).toEqual(2);
      expect(result.current[0].countActive).toBe(1);
    });

    it("should success", async () => {
      const { result } = renderHook(useTodos);

      mockService.clearTodos.mockResolvedValueOnce(true);

      await act(result.current[1].clearAll);

      expect(mockService.clearTodos).toBeCalledWith([fakeTodos[0].id]);
      expect(result.current[0].todos.size).toEqual(1);
      expect(result.current[0].countActive).toBe(1);
    });
  });

  it("should add an item", async () => {
    const { result } = renderHook(useTodos);

    const newTodo = fakeTodo({ status: TodoStatus.ACTIVE });

    mockService.createTodo.mockResolvedValueOnce(fakeTodo(newTodo));
    await act(async () => {
      await result.current[1].create("TodoContent");
    });

    expect(mockService.createTodo).toBeCalledWith("TodoContent");

    expect(result.current[0].todos.size).toEqual(2);
    expect(result.current[0].todos.get(newTodo.id)).toEqual(newTodo);
    expect(result.current[0].countActive).toBe(2);
  });

  describe("remove an item", () => {
    it("should skip from api", async () => {
      const { result } = renderHook(useTodos);

      mockService.removeTodo.mockResolvedValueOnce(false);
      const removeId = Array.from(result.current[0].todos.keys())[0];

      await act(async () => {
        await result.current[1].remove(removeId);
      });

      expect(mockService.removeTodo).toBeCalledWith(removeId);
      expect(result.current[0].todos.size).toEqual(2);
      expect(result.current[0].countActive).toBe(2);
    });

    it("should success", async () => {
      const { result } = renderHook(useTodos);

      mockService.removeTodo.mockResolvedValueOnce(true);
      const removeId = Array.from(result.current[0].todos.keys())[0];

      await act(async () => {
        await result.current[1].remove(removeId);
      });

      expect(mockService.removeTodo).toBeCalledWith(removeId);
      expect(result.current[0].todos.size).toEqual(1);
      expect(result.current[0].countActive).toBe(1);
    });
  });

  describe("update status an item", () => {
    it("should skip the same", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateTodoStatus.mockResolvedValueOnce(true);
      const updateId = Array.from(result.current[0].todos.keys())[0];

      await act(async () => {
        await result.current[1].updateStatus(updateId, true);
      });

      expect(mockService.updateTodoStatus).not.toBeCalled();
    });

    it("should skip from api", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateTodoStatus.mockResolvedValueOnce(false);
      const updateId = Array.from(result.current[0].todos.keys())[0];

      await act(async () => {
        await result.current[1].updateStatus(updateId, false);
      });

      expect(mockService.updateTodoStatus).toBeCalledWith(
        updateId,
        TodoStatus.COMPLETED
      );

      expect(result.current[0].todos.get(updateId)!.status).toBe(
        TodoStatus.ACTIVE
      );
    });

    it("should success", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateTodoStatus.mockResolvedValueOnce(true);
      const updateId = Array.from(result.current[0].todos.keys())[0];

      await act(async () => {
        await result.current[1].updateStatus(updateId, false);
      });

      expect(mockService.updateTodoStatus).toBeCalledWith(
        updateId,
        TodoStatus.COMPLETED
      );
      expect(result.current[0].todos.get(updateId)!.status).toBe(
        TodoStatus.COMPLETED
      );
    });
  });

  describe("update content an item", () => {
    it("should skip the same", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateTodoContent.mockResolvedValueOnce(true);
      const updateItem = Array.from(result.current[0].todos.values())[0];

      await act(async () => {
        await result.current[1].updateContent(
          updateItem.id,
          updateItem.content
        );
      });

      expect(mockService.updateTodoContent).not.toBeCalled();
    });

    it("should skip from api", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateTodoContent.mockResolvedValueOnce(false);
      const updateItem = Array.from(result.current[0].todos.values())[0];

      await act(async () => {
        await result.current[1].updateContent(updateItem.id, "new content");
      });

      expect(mockService.updateTodoContent).toBeCalledWith(
        updateItem.id,
        "new content"
      );
      expect(result.current[0].todos.get(updateItem.id)!.content).toBe(
        updateItem.content
      );
    });

    it("should success", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateTodoContent.mockResolvedValueOnce(true);
      const updateItem = Array.from(result.current[0].todos.values())[0];

      await act(async () => {
        await result.current[1].updateContent(updateItem.id, "new content");
      });

      expect(mockService.updateTodoContent).toBeCalledWith(
        updateItem.id,
        "new content"
      );
      expect(result.current[0].todos.get(updateItem.id)!.content).toBe(
        "new content"
      );
    });
  });

  describe("toggle status all items", () => {
    it("should skip from api", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateAllTodoStatus.mockResolvedValueOnce(false);

      await act(() => result.current[1].toggleAll(false));

      expect(mockService.updateAllTodoStatus).toBeCalledWith(
        TodoStatus.COMPLETED
      );
      expect(result.current[0].todos.size).toEqual(1);
      expect(result.current[0].countActive).toBe(0);
    });

    it("should active success", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateAllTodoStatus.mockResolvedValueOnce(true);

      await act(() => result.current[1].toggleAll(true));

      expect(mockService.updateAllTodoStatus).toBeCalledWith(TodoStatus.ACTIVE);
      expect(result.current[0].todos.size).toEqual(1);
      expect(result.current[0].countActive).toBe(1);
    });

    it("should complete success", async () => {
      const { result } = renderHook(useTodos);

      mockService.updateAllTodoStatus.mockResolvedValueOnce(true);

      await act(() => result.current[1].toggleAll(false));

      expect(mockService.updateAllTodoStatus).toBeCalledWith(
        TodoStatus.COMPLETED
      );
      expect(result.current[0].todos.size).toEqual(1);
      expect(result.current[0].countActive).toBe(0);
    });
  });
});
