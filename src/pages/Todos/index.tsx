import { useEffect } from "react";
import { Container } from "react-bootstrap";

import { usePushLoader } from "components/Loader";
import { useTodoActions } from "store/Todos";

import TodoForm from "./Form";
import TodoList from "./List";
import TodoToolbar from "./Toolbar";

const ToDoPage = () => {
  const todoActions = useTodoActions();
  const pushLoader = usePushLoader();

  useEffect(() => {
    pushLoader(todoActions.initialize());
  }, [pushLoader, todoActions]);

  return (
    <div>
      <TodoToolbar />
      <TodoList />
      <div className="position-sticky bg-light py-2" style={{ bottom: 0 }}>
        <Container>
          <TodoForm onSubmit={todoActions.create} />
        </Container>
      </div>
    </div>
  );
};

export default ToDoPage;
