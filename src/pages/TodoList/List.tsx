import { useEffect, useMemo } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import { useTodoList } from "store/TodoList";
import TodoItem from "./Item";
import { useTodoFilter } from "./Store.filter";

export default function TodoList() {
  const [{ todos }] = useTodoList();
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

  useEffect(() => {}, [visible.length]);

  return (
    <Container maxWidth="sm">
      {visible.length ? (
        <List>
          {visible.map((todo) => (
            <TodoItem key={todo.id} item={todo} />
          ))}
        </List>
      ) : (
        <Typography variant="h4" color="gray" textAlign="center" p={2}>
          No result
        </Typography>
      )}
    </Container>
  );
}
