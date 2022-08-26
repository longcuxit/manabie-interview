import { ReactNode } from "react";
import { ModalProps } from "react-bootstrap";

export interface AsyncConfirmProps {
  title?: ReactNode;
  message?: ReactNode;
  footer?: ReactNode;
  cancel?: string;
  accept?: string;
}

export type RendererAsyncModal<T = unknown> = (
  pop: (result?: T) => void,
  props?: ModalProps
) => ReactNode;

export type ShowAsyncModal<T> = (content: RendererAsyncModal<T>) => Promise<T>;
