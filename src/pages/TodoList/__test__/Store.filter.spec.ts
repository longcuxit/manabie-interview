import { act } from "@testing-library/react";
import { TodoStatus } from "models/Todo";
import { renderHook } from "utils/testting";
import { useTodoFilter } from "../Store.filter";

describe("pages/Todos/Store.filter:", () => {
  it("keyword", () => {
    const { result } = renderHook(useTodoFilter);

    expect(result.current[0].keyword).toBe("");

    act(() => {
      result.current[1].keyword("keyword");
    });

    expect(result.current[0].keyword).toBe("keyword");
  });

  it("status", () => {
    const { result } = renderHook(useTodoFilter);

    expect(result.current[0].status).toBe("ALL");

    act(() => {
      result.current[1].status(TodoStatus.ACTIVE);
    });

    expect(result.current[0].status).toBe(TodoStatus.ACTIVE);
  });
});
