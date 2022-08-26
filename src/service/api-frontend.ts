import { IAPI } from "./types";
import { TodoModel, TodoStatus } from "models/Todo";
import { AuthModel } from "models/User";
import { createStoreSelect, StoreMode, StoreSelect, toAsync } from "./indexDB";

let todoStore: StoreSelect;

class ApiFrontend extends IAPI {
  async connect() {
    const request = indexedDB.open("todo-" + process.env.NODE_ENV, 1);

    request.onupgradeneeded = (e) => {
      const db = request.result;
      if (!db.objectStoreNames.contains("toDoList")) {
        db.createObjectStore("toDoList", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    const db = await toAsync(request);
    todoStore = createStoreSelect(db, "toDoList");
    return true;
  }

  async getTodos(): Promise<TodoModel[]> {
    return toAsync(todoStore().getAll());
  }

  async createTodo(content: string): Promise<TodoModel> {
    const newTodo: Omit<TodoModel, "id"> = {
      content,
      created_date: Date.now(),
      status: TodoStatus.ACTIVE,
      user_id: "user_id",
    };
    const id = await toAsync(todoStore(StoreMode.readwrite).add(newTodo));
    return { ...newTodo, id: id.toString() };
  }

  async removeTodo(id: string): Promise<boolean> {
    await toAsync(todoStore(StoreMode.readwrite).delete(+id));
    return true;
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<boolean> {
    const todo = await toAsync<TodoModel>(todoStore().get(+id));
    todo.status = status;
    await toAsync(todoStore(StoreMode.readwrite).put(todo));
    return true;
  }

  async updateTodoContent(id: string, content: string): Promise<boolean> {
    const todo = await toAsync<TodoModel>(todoStore().get(+id));
    todo.content = content;
    await toAsync(todoStore(StoreMode.readwrite).put(todo));
    return true;
  }

  async clearTodos(ids?: string[]): Promise<boolean> {
    if (ids) {
      const store = todoStore(StoreMode.readwrite);
      await Promise.all(ids.map((id) => toAsync(store.delete(+id))));
    } else {
      await toAsync(todoStore(StoreMode.readwrite).clear());
    }

    return true;
  }

  async updateAllTodoStatus(status: TodoStatus): Promise<boolean> {
    return new Promise((next, error) => {
      const store = todoStore(StoreMode.readwrite);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return next(true);
        if (cursor.value.status !== status) {
          cursor.value.status = status;
          cursor.update(cursor.value);
        }
        cursor.continue();
      };
      req.onerror = () => error(req.error);
    });
  }

  async login(username: string, password: string): Promise<AuthModel> {
    return { accessToken: "accessToken", refreshToken: "refreshToken" };
  }
}

export default new ApiFrontend();
