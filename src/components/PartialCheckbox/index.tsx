import classNames from "classnames";
import { createElement } from "react";
import { FormCheck, FormCheckProps } from "react-bootstrap";

import "./style.css";

export interface PartialCheckboxProps extends FormCheckProps {}

export function PartialCheckbox({ ...props }: PartialCheckboxProps) {
  const isPartial = props.checked === undefined;
  props.checked = props.checked || false;
  if (isPartial) props.className = classNames(props.className, "check-partial");
  return createElement(FormCheck, props);
}
