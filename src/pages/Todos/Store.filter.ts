import { debounce } from "utils";
import { Store } from "utils/Store";
import { StatusFilter, TodoFilterActions, TodoFilterState } from "./type";

const initialState: TodoFilterState = {
  keyword: "",
  status: "ALL",
};

const store = new Store<TodoFilterState, TodoFilterActions>(
  initialState,
  ({ partial }) => ({
    keyword: debounce((keyword: string) => partial({ keyword }), 300),
    status: (status: StatusFilter) => partial({ status }),
  })
);

export const useTodoFilter = store.createHook();
