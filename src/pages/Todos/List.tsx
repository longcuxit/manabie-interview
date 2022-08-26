import { useMemo } from "react";
import { Container, ListGroup } from "react-bootstrap";

import { useTodos } from "store/Todos";
import TodoItem from "./Item";
import { useTodoFilter } from "./Store.filter";

export default function TodoList() {
  const [{ todos }] = useTodos();
  const [{ status, keyword }] = useTodoFilter();

  const visible = useMemo(() => {
    let visible = Array.from(todos.values());

    if (status !== "ALL") {
      visible = visible.filter((todo) => todo.status === status);
    }

    if (keyword.length) {
      const lowerKey = keyword.toLowerCase();
      visible = visible.filter((todo) =>
        todo.content.toLowerCase().includes(lowerKey)
      );
    }

    return visible;
  }, [status, keyword, todos]);

  return (
    <Container className="my-2">
      <ListGroup className="ToDo__list">
        {visible.map((todo) => (
          <TodoItem key={todo.id} item={todo} />
        ))}
      </ListGroup>
    </Container>
  );
}
