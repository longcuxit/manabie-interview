import { FocusEvent, Fragment, useState } from "react";

import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";

import Clear from "@mui/icons-material/Clear";

import { TodoModel, TodoStatus } from "models/Todo";
import { useTodoActions } from "store/TodoList";
import { useLoading, withLoader } from "components/Loader";
import { usePushAskConfirm } from "components/AsyncRender";
import { createLocalStorage } from "utils";
import TodoForm from "./Form";

export interface TodoItemProps {
  item: TodoModel;
}

const askMe = createLocalStorage("DeleteAnItem", true);

function TodoItem({ item }: TodoItemProps) {
  const actions = useTodoActions();
  const showConfirm = usePushAskConfirm();
  const [loading, pushLoader] = useLoading();

  const [editMode, setEditMode] = useState(false);

  const isActive = item.status === TodoStatus.ACTIVE;

  const handleDelete = () => {
    return pushLoader(
      showConfirm({
        shouldAsk: askMe,
        title: "Delete todo",
        message: "Are you sure delete this Todo?",
      }).then((ok) => {
        if (ok) actions.remove(item.id);
      })
    );
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    const related = e.relatedTarget as HTMLElement;
    if (related && related.parentElement === e.currentTarget) return;
    setEditMode(false);
  };

  return (
    <ListItem disablePadding>
      {editMode ? (
        <TodoForm
          defaultValue={item.content}
          onBlur={handleBlur}
          onSubmit={async (value: string) => {
            await actions.updateContent(item.id, value);
            setEditMode(false);
          }}
        />
      ) : (
        <Fragment>
          <Checkbox
            edge="start"
            checked={!isActive}
            onChange={() =>
              pushLoader(actions.updateStatus(item.id, !isActive))
            }
            tabIndex={-1}
          />
          <ListItemText
            primary={item.content}
            onDoubleClick={() => setEditMode(true)}
            role="article"
          />
          {loading ? (
            <CircularProgress size={16} />
          ) : (
            <IconButton edge="end" onClick={handleDelete} role="deletion">
              <Clear />
            </IconButton>
          )}
        </Fragment>
      )}
    </ListItem>
  );
}
export default withLoader(TodoItem);
