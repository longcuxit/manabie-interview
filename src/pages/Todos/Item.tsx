import { FocusEvent, useState } from "react";
import { CloseButton, FormCheck, ListGroup, Spinner } from "react-bootstrap";

import classNames from "classnames";

import { TodoStatus } from "models/Todo";
import { useTodoActions } from "store/Todos";
import { useLoading, withLoader } from "components/Loader";
import { useAsyncConfirm } from "components/AsyncModal";
import { createLocalStorage } from "utils";
import TodoForm from "./Form";
import { TodoItemProps } from "./type";

const askMeDelete = createLocalStorage("DeleteAnItem", true);

function TodoItem({ item }: TodoItemProps) {
  const actions = useTodoActions();
  const showConfirm = useAsyncConfirm();
  const [loading, pushLoader] = useLoading();

  const [editMode, setEditMode] = useState(false);

  const isActive = item.status === TodoStatus.ACTIVE;

  const handleDelete = () => {
    return pushLoader(
      (async () => {
        const isRemove =
          !askMeDelete.get() ||
          (await showConfirm({
            title: "Delete todo",
            message: "Are you sure delete this Todo?",
            footer: (
              <FormCheck
                className="flex-fill"
                label="Don't ask again!"
                onChange={({ target }) => askMeDelete.set(!target.checked)}
              />
            ),
          }));
        if (isRemove) await actions.remove(item.id);
      })()
    );
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    const related = e.relatedTarget as HTMLElement;
    if (related && related.parentElement === e.currentTarget) return;
    setEditMode(false);
  };

  return (
    <ListGroup.Item
      className={classNames(
        "d-flex flex-row p-2 align-items-center",
        loading && "disabled"
      )}
      onDoubleClick={() => setEditMode(true)}
    >
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
        <>
          <label className="label-big-holder">
            <FormCheck
              checked={!isActive}
              onChange={() =>
                pushLoader(actions.updateStatus(item.id, !isActive))
              }
            />
          </label>
          <div className="flex-fill px-2">{item.content}</div>
          {loading ? (
            <Spinner animation="border" size="sm" className="mx-1" />
          ) : (
            <CloseButton onClick={handleDelete} />
          )}
        </>
      )}
    </ListGroup.Item>
  );
}
export default withLoader(TodoItem);
