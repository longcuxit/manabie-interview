import { useEffect } from "react";
import Container from "@mui/material/Container";

import { usePushLoader } from "components/Loader";
import { useTodoActions } from "store/Todos";

import TodoForm from "./Form";
import TodoList from "./List";
import TodoToolbar from "./Toolbar";

import "./style.css";

const ToDoPage = () => {
  const todoActions = useTodoActions();
  const pushLoader = usePushLoader();

  useEffect(() => {
    pushLoader(todoActions.initialize());
  }, [pushLoader, todoActions]);

  return (
    <div className="Page-todos">
      <TodoToolbar />
      <TodoList />
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <TodoForm onSubmit={todoActions.create} />
      </Container>
    </div>
  );
};

export default ToDoPage;
