import { TodoModel, TodoStatus } from "models/Todo";
import { loremIpsum } from "lorem-ipsum";
import shortid from "shortid";

const status = [TodoStatus.ACTIVE, TodoStatus.COMPLETED];

export const fakeTodo = (from?: Partial<TodoModel>): TodoModel => ({
  content: loremIpsum(),
  created_date: Date.now(),
  status: status[~~(Math.random() * (status.length + 1))],
  id: shortid(),
  user_id: "user_id",
  ...from,
});
