import {
  createElement,
  useState,
  useEffect,
  ComponentType,
  FunctionComponent,
} from "react";
import classNames from "classnames";
import { Spinner, SpinnerProps } from "react-bootstrap";
import { BsPrefixProps } from "react-bootstrap/esm/helpers";

import { LoaderContainer, useLoading } from "./Store";

import "./style.css";

export interface LoaderWrapperProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  duration?: number;
  SpinnerProps?: SpinnerProps;
}

export function LoaderWrapper({
  as = "div",
  duration = 300,
  children,
  SpinnerProps = { animation: "border" },
  ...props
}: LoaderWrapperProps) {
  const [loading] = useLoading();
  const [isIn, setIsIn] = useState(false);

  props.className = classNames(
    props.className,
    "Loader",
    loading && "Loader-loading",
    isIn && "in"
  );
  props.style = { ...props.style, "--loader-duration": duration + "ms" } as any;

  useEffect(() => {
    if (loading && !isIn) requestAnimationFrame(() => setIsIn(true));
    else if (!loading && isIn) {
      const timeOut = setTimeout(() => setIsIn(false), duration);
      return () => clearTimeout(timeOut);
    }
  }, [loading, isIn, duration]);

  return createElement(
    as,
    props,
    <>
      {children}
      {(loading || isIn) && (
        <div className="Loader-spinner">
          {createElement(Spinner, SpinnerProps)}
        </div>
      )}
    </>
  );
}

const initialState = { total: 0, count: 0 };

export function withLoader<P>(Com: ComponentType<P>): FunctionComponent<P> {
  return (props: P) => {
    return (
      <LoaderContainer state={initialState}>
        {createElement(Com, props)}
      </LoaderContainer>
    );
  };
}
