import { TodoModel, TodoStatus } from "models/Todo";
import { FocusEventHandler } from "react";

export type StatusFilter = TodoStatus | "ALL";

export interface TodoFilterState {
  keyword: string;
  status: StatusFilter;
}

export interface TodoFilterActions {
  keyword(keyword: string): void;
  status(status: StatusFilter): void;
}

export interface TodoItemProps {
  item: TodoModel;
}

export interface TodoFormProps {
  defaultValue?: string;
  onSubmit: (value: string) => Promise<void>;
  onBlur?: FocusEventHandler<HTMLFormElement>;
}
