import { TodoModel } from "models/Todo";

export interface TodoState {
  todos: Map<string, TodoModel>;
  countActive: number;
}

export interface TodoActions {
  initialize(): Promise<void>;
  create(content: string): Promise<void>;
  remove(id: string): Promise<void>;
  updateStatus(id: string, active: boolean): Promise<void>;
  updateContent(id: string, content: string): Promise<void>;
  clearAll(): Promise<void>;
  toggleAll(active: boolean): Promise<void>;
}
