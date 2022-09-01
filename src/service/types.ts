import { AuthModel } from "models/User";
import { TodoModel, TodoStatus } from "models/Todo";

export abstract class IAPI {
  abstract connect(): Promise<boolean>;
  abstract getTodos(): Promise<Array<TodoModel>>;
  abstract createTodo(content: string): Promise<TodoModel>;
  abstract updateTodoStatus(id: string, status: TodoStatus): Promise<boolean>;
  abstract updateTodoContent(id: string, content: string): Promise<boolean>;
  abstract removeTodo(id: string): Promise<boolean>;
  abstract clearTodos(ids?: string[]): Promise<boolean>;
  abstract updateAllTodoStatus(status: TodoStatus): Promise<boolean>;
  abstract login(username: string, password: string): Promise<AuthModel>;
}
