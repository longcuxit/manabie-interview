import { TodoModel, TodoStatus } from "models/Todo";
import Service from "service";
import { Store } from "utils/Store";
import { TodoActions, TodoState } from "./TodoList.type";

const initialState: TodoState = {
  todos: new Map<string, TodoModel>(),
  countActive: 0,
};

const store = new Store<TodoState, TodoActions>(
  initialState,
  ({ set, get }) => ({
    async initialize(): Promise<void> {
      const todos = await Service.getTodos();
      const map = new Map<string, TodoModel>();
      let countActive = 0;

      todos.forEach((todo) => {
        if (todo.status === TodoStatus.ACTIVE) countActive++;
        map.set(todo.id, todo);
      });

      set({ todos: map, countActive });
    },

    async create(content: string): Promise<void> {
      const newTodo = await Service.createTodo(content);
      set(({ todos, countActive }) => {
        todos.set(newTodo.id, newTodo);

        return {
          todos: new Map(todos),
          countActive: countActive + +(newTodo.status === TodoStatus.ACTIVE),
        };
      });
    },

    async remove(id: string): Promise<void> {
      if (!(await Service.removeTodo(id))) return;

      set((state) => {
        const exist = state.todos.get(id)!;

        state.todos.delete(id);
        state.countActive -= +(exist.status === TodoStatus.ACTIVE);

        return { ...state, todos: new Map(state.todos) };
      });
    },

    async updateStatus(id: string, active: boolean): Promise<void> {
      const toStatus = active ? TodoStatus.ACTIVE : TodoStatus.COMPLETED;

      const todo = get().todos.get(id)!;
      if (todo.status === toStatus) return;

      if (!(await Service.updateTodoStatus(id, toStatus))) return;

      set((state) => {
        todo.status = toStatus;
        state.todos.set(id, { ...todo });
        state.countActive += +active * 2 - 1;

        return { ...state, todos: new Map(state.todos) };
      });
    },

    async updateContent(id: string, content: string): Promise<void> {
      const todo = get().todos.get(id)!;
      if (todo.content === content) return;
      if (!(await Service.updateTodoContent(id, content))) return;

      set((state) => {
        todo.content = content;
        state.todos.set(id, { ...todo });
        return { ...state, todos: new Map(state.todos) };
      });
    },

    async clearAll(): Promise<void> {
      const { todos } = get();

      const deleteIds: string[] = [];
      get().todos.forEach((todo) => {
        if (todo.status === TodoStatus.COMPLETED) {
          deleteIds.push(todo.id);
        }
      });

      if (!(await Service.clearTodos(deleteIds))) return;
      deleteIds.forEach(todos.delete.bind(todos));

      set({ countActive: todos.size, todos: new Map(todos) });
    },

    async toggleAll(active: boolean): Promise<void> {
      const toStatus = active ? TodoStatus.ACTIVE : TodoStatus.COMPLETED;
      if (!(await Service.updateAllTodoStatus(toStatus))) return;

      set((state) => {
        state.todos.forEach((todo) => {
          state.todos.set(todo.id, { ...todo, status: toStatus });
        });

        state.countActive = active ? state.todos.size : 0;

        return { ...state, todos: new Map(state.todos) };
      });
    },
  })
);

export const useTodoList = store.createHook();

export const useTodoActions = store.createHookAction();

export * from "./TodoList.type";
