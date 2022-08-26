import classNames from "classnames";
import { useLoading } from "components/Loader";
import { FocusEventHandler, FormEvent, MouseEvent, useState } from "react";
import { InputGroup, FormControl, Spinner } from "react-bootstrap";
import { Send, PencilFill } from "react-bootstrap-icons";

export interface TodoFormProps {
  defaultValue?: string;
  onSubmit: (value: string) => Promise<void>;
  onBlur?: FocusEventHandler<HTMLFormElement>;
}

export default function TodoForm({
  defaultValue = "",
  onSubmit,
  onBlur,
}: TodoFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [loading, pushLoader] = useLoading();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    await pushLoader(onSubmit(value));
    setValue("");
  };
  const handleBtnFocus = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const input = currentTarget.previousElementSibling as HTMLInputElement;
    input.focus();
  };

  return (
    <InputGroup
      as="form"
      className={classNames(loading && "disabled")}
      onSubmit={handleSubmit}
      onBlur={onBlur}
    >
      <FormControl
        autoFocus
        value={value}
        placeholder="What you will do ..."
        onChange={({ target }) => setValue(target.value.trimLeft())}
      />
      {loading ? (
        <InputGroup.Text>
          <Spinner animation="border" size="sm" />
        </InputGroup.Text>
      ) : value ? (
        <InputGroup.Text as="button" type="submit" className="btn-send">
          <Send />
        </InputGroup.Text>
      ) : (
        <InputGroup.Text
          as="button"
          className="btn-focus"
          type="button"
          onClick={handleBtnFocus}
        >
          <PencilFill className="icon-pencil-fill" />
        </InputGroup.Text>
      )}
    </InputGroup>
  );
}
