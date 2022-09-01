import { MouseEvent } from "react";

import AppBar from "@mui/material/AppBar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

import Clear from "@mui/icons-material/Clear";
import Search from "@mui/icons-material/Search";
import DeleteSweep from "@mui/icons-material/DeleteSweep";
import Logout from "@mui/icons-material/Logout";

import { TodoStatus } from "models/Todo";
import { useAuthAction } from "store/Auth";
import { useTodos } from "store/Todos";

import { usePushLoader } from "components/Loader";
import { usePushAskConfirm } from "components/AsyncRender";

import { StatusFilter, useTodoFilter } from "./Store.filter";

import { createLocalStorage } from "utils";

const statusList: StatusFilter[] = [
  "ALL",
  TodoStatus.ACTIVE,
  TodoStatus.COMPLETED,
];

const LogoutButton = () => {
  const authAction = useAuthAction();
  return (
    <IconButton color="inherit" onClick={authAction.logout}>
      <Logout />
    </IconButton>
  );
};

const askMe = createLocalStorage("DeleteAllItems", true);

export default function TodoToolbar() {
  const showConfirm = usePushAskConfirm();
  const pushLoader = usePushLoader();

  const [{ todos, countActive }, todoActions] = useTodos();
  const [{ status, keyword }, filterActions] = useTodoFilter();

  const handleDelete = () => {
    return showConfirm({
      shouldAsk: askMe,
      title: "Delete all completed todo",
      message: "Are you sure to clear all completed Todo?",
    }).then((ok) => {
      if (ok) pushLoader(todoActions.clearAll());
    });
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
    <AppBar component="header" position="sticky">
      <Container maxWidth="sm" disableGutters>
        <Toolbar variant="dense">
          {Boolean(todos.size) && (
            <Checkbox
              edge="start"
              checked={countActive === 0 || !(countActive === todos.size)}
              indeterminate={countActive > 0 && countActive < todos.size}
              color="default"
              onChange={({ target }) => {
                pushLoader(todoActions.toggleAll(!target.checked));
              }}
            />
          )}
          <OutlinedInput
            role="searchbox"
            placeholder="Search ..."
            size="small"
            color="primary"
            fullWidth
            inputProps={{ sx: { color: "#fff" } }}
            onChange={({ target }) => {
              filterActions.keyword(target.value.trimStart());
            }}
            endAdornment={
              keyword ? (
                <IconButton edge="end" onClick={handleClear} role="deletion">
                  <Clear />
                </IconButton>
              ) : (
                <IconButton edge="end" onClick={handleFocus} role="search">
                  <Search />
                </IconButton>
              )
            }
          />
          <Select
            value={status}
            size="small"
            color="secondary"
            sx={{ mx: 1 }}
            onChange={({ target }) => filterActions.status(target.value as any)}
            displayEmpty
          >
            {statusList.map((item) => {
              return (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>

          <IconButton
            onClick={handleDelete}
            disabled={todos.size === countActive}
            color="inherit"
            role="clear"
          >
            <DeleteSweep />
          </IconButton>
          <LogoutButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
