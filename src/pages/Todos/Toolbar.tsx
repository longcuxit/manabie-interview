import { MouseEvent } from "react";
import {
  Navbar,
  Container,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
  FormControl,
  FormCheck,
} from "react-bootstrap";
import { BoxArrowRight, Search, Trash, XLg } from "react-bootstrap-icons";

import { createLocalStorage } from "utils";
import { TodoStatus } from "models/Todo";
import { useAuthAction } from "store/Auth";
import { useTodos } from "store/Todos";

import { usePushLoader } from "components/Loader";
import { PartialCheckbox } from "components/PartialCheckbox";
import { useAsyncConfirm } from "components/AsyncModal";

import { StatusFilter, useTodoFilter } from "./Store.filter";

const statusList: StatusFilter[] = [
  "ALL",
  TodoStatus.ACTIVE,
  TodoStatus.COMPLETED,
];

const askMeDeleteAll = createLocalStorage("DeleteAllItems", true);

const LogoutButton = () => {
  const authAction = useAuthAction();
  return (
    <Button className="ms-2" size="sm" onClick={authAction.logout}>
      <BoxArrowRight />
    </Button>
  );
};

export default function TodoToolbar() {
  const showConfirm = useAsyncConfirm();
  const pushLoader = usePushLoader();

  const [{ todos, countActive }, todoActions] = useTodos();
  const [{ status, keyword }, filterActions] = useTodoFilter();

  const handleDelete = async () => {
    const isRemove =
      !askMeDeleteAll.get() ||
      (await showConfirm({
        title: "Delete all completed todo",
        message: "Are you sure to clear all completed Todo?",
        footer: (
          <FormCheck
            className="flex-fill"
            label="Don't ask again!"
            onChange={({ target }) => askMeDeleteAll.set(!target.checked)}
          />
        ),
      }));
    if (isRemove) pushLoader(todoActions.clearAll());
  };

  const handleClear = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const input = currentTarget.previousElementSibling as HTMLInputElement;
    filterActions.keyword("");
    input.value = "";
  };

  const handleFocus = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const input = currentTarget.previousElementSibling as HTMLInputElement;
    input.focus();
  };

  return (
    <Navbar bg="primary" className="sticky-top">
      <Container>
        {Boolean(todos.size) && (
          <PartialCheckbox
            className="mx-2"
            checked={
              countActive === todos.size
                ? false
                : countActive === 0
                ? true
                : undefined
            }
            onChange={({ target }) =>
              pushLoader(todoActions.toggleAll(!target.checked))
            }
          />
        )}
        <InputGroup size="sm">
          <FormControl
            placeholder="Search ..."
            onChange={({ target }) => {
              filterActions.keyword(target.value.trimLeft());
            }}
          />
          {keyword ? (
            <InputGroup.Text
              as="button"
              className="btn-clear"
              onClick={handleClear}
            >
              <XLg />
            </InputGroup.Text>
          ) : (
            <InputGroup.Text
              as="button"
              className="btn-focus"
              onClick={handleFocus}
            >
              <Search />
            </InputGroup.Text>
          )}
        </InputGroup>
        <DropdownButton
          title={status}
          onSelect={(key) => filterActions.status(key as StatusFilter)}
          size="sm"
          className="mx-2"
          align="end"
        >
          {statusList.map((item) => {
            return (
              <Dropdown.Item key={item} eventKey={item}>
                {item}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
        <Button
          size="sm"
          onClick={handleDelete}
          variant="danger"
          disabled={todos.size === countActive}
        >
          <Trash />
        </Button>
        <LogoutButton />
      </Container>
    </Navbar>
  );
}
