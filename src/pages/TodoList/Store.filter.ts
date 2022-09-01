import { TodoStatus } from "models/Todo";
import { debounce } from "utils";
import { Store } from "utils/Store";

export type StatusFilter = TodoStatus | "ALL";

export interface TodoFilterState {
  keyword: string;
  status: StatusFilter;
}

const initialState: TodoFilterState = {
  keyword: "",
  status: "ALL",
};

const store = new Store(initialState, ({ partial }) => ({
  keyword: debounce((keyword: string) => partial({ keyword }), 300),
  status: (status: StatusFilter) => partial({ status }),
}));

export const useTodoFilter = store.createHook();
