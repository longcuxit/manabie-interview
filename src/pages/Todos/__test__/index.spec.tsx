import { render } from "@testing-library/react";

import { useTodoActions } from "store/Todos";
import { usePushLoader } from "components/Loader";
import ToDoPage from "../index";

jest.mock("store/Todos", () => ({ useTodoActions: jest.fn() }));
jest.mock("components/Loader", () => ({ usePushLoader: jest.fn() }));

jest.mock("../Toolbar", () => () => <div>TodoToolbar</div>);
jest.mock("../List", () => () => <div>TodoList</div>);
jest.mock("../Form", () => () => <div>TodoForm</div>);

const mockUseTodoActions = useTodoActions as jest.Mock;
const mockUsePushLoader = usePushLoader as jest.Mock;

describe("pages/Todos/List", () => {
  const initialize = jest.fn();
  const pushLoader = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTodoActions.mockReturnValue({ initialize });
    mockUsePushLoader.mockReturnValue(pushLoader);
  });

  it("should initialize todos", () => {
    render(<ToDoPage />);

    expect(initialize).toBeCalledTimes(1);
    expect(pushLoader).toBeCalledTimes(1);
  });
});
