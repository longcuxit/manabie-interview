import { SpinnerProps } from "react-bootstrap";
import { BsPrefixProps } from "react-bootstrap/esm/helpers";

export interface LoaderWrapperProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  duration?: number;
  SpinnerProps?: SpinnerProps;
}
