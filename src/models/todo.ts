export enum TodoStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

export interface TodoModel {
  content: string;
  created_date: number;
  status: TodoStatus;
  id: string;
  user_id: string;
}
