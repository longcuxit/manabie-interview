import { Fragment, memo, ReactNode } from "react";
import { Store } from "utils";

export interface AsyncModalProps {
  children: ReactNode;
}

export type AsyncRenderer<T = any> = (
  open: boolean,
  pop: (result: T) => void,
  exited: () => void
) => JSX.Element;

export interface AsyncRenderStack<T = any> {
  key: number;
  pop: (value: T) => void;
  exited: () => void;
  render: AsyncRenderer<T>;
}

type State = { renders: AsyncRenderStack[]; active?: AsyncRenderStack };

const initialState: State = { renders: [] };

let idIncrement = 0;

const store = new Store(
  initialState,
  ({ set, get, partial }) => {
    return function <T>(render: AsyncRenderer<T>): Promise<T> {
      return new Promise<T>((resolve) => {
        function exited() {
          const { renders } = get();
          const index = renders.indexOf(item);
          if (index < renders.length - 1) return;
          renders.splice(index, 1);
          partial({ renders: [...renders] });
        }

        function pop(value: T) {
          const { renders } = get();
          const index = renders.indexOf(item);
          partial({ active: renders[index - 1] });
          resolve(value);
        }

        const key = idIncrement++;

        const item: AsyncRenderStack<T> = { pop, render, exited, key };

        set({ renders: [...get().renders, item], active: item });
      });
    };
  },
  "Navigation"
);

const useRender = store.createHook();
export const usePushRender = store.createHookAction();

interface PureRenderProps extends AsyncRenderStack {
  open: boolean;
}

const PureRender = memo(({ render, pop, open, exited }: PureRenderProps) => (
  <Fragment>{render(open, pop, exited)}</Fragment>
));

export const AsyncRenderContainer = ({ children }: AsyncModalProps) => {
  const [{ renders, active }] = useRender();

  return (
    <Fragment>
      {children}
      {renders.map((item) => (
        <PureRender {...item} open={item === active} />
      ))}
    </Fragment>
  );
};
