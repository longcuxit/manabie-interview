import { FocusEventHandler, FormEvent, MouseEvent, useState } from "react";
import { toast } from "react-toastify";

import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";

import Edit from "@mui/icons-material/Edit";
import Send from "@mui/icons-material/Send";

import { BoxDisabled } from "components/BoxDisabled";
import { useLoading, withLoader } from "components/Loader";

export interface TodoFormProps {
  defaultValue?: string;
  onSubmit: (value: string) => Promise<void>;
  onBlur?: FocusEventHandler<HTMLElement>;
}

function TodoForm({ defaultValue = "", onSubmit, onBlur }: TodoFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [loading, pushLoader] = useLoading();

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!value) return;
    pushLoader(onSubmit(value)).then(() => {
      setValue("");
      toast.success("A new todo created");
    });
  };
  const handleBtnFocus = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const input = currentTarget!.previousElementSibling as HTMLInputElement;
    input.focus();
  };

  return (
    <BoxDisabled
      component="form"
      role="form"
      display="flex"
      onSubmit={handleSubmit}
      onBlur={onBlur}
      width="100%"
    >
      <OutlinedInput
        autoFocus
        fullWidth
        size="small"
        value={value}
        placeholder="What you will do ..."
        onChange={({ target }) => setValue(target.value.trimStart())}
        endAdornment={
          loading ? (
            <CircularProgress size={16} />
          ) : value ? (
            <IconButton edge="end" type="submit">
              <Send />
            </IconButton>
          ) : (
            <IconButton edge="end" onClick={handleBtnFocus}>
              <Edit />
            </IconButton>
          )
        }
      />
    </BoxDisabled>
  );
}

export default withLoader(TodoForm);
