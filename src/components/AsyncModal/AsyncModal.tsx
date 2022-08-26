import { ReactNode } from "react";
import { Modal, ModalProps } from "react-bootstrap";
import { Store } from "utils/Store";

export type RendererAsyncModal<T = unknown> = (
  pop: (result?: T) => void,
  props?: ModalProps
) => ReactNode;

export type ShowAsyncModal<T> = (content: RendererAsyncModal<T>) => Promise<T>;

type ModalStack<T = any> = {
  id: number;
  pop: (value?: T) => void;
  props?: ModalProps;
  render: RendererAsyncModal;
};

interface State {
  modals: ModalStack[];
  current?: ModalStack;
}

const initialState: State = { modals: Array<ModalStack>() };

let idIncrement = 0;

const store = new Store(initialState, ({ set, get, partial }) => {
  return function <T>(render: RendererAsyncModal<T>, props?: ModalProps) {
    let item: ModalStack<T>;
    const promise = new Promise<T | void>((pop) => {
      item = { pop, render, props, id: idIncrement++ };
      set({ modals: [...get().modals, item], current: item });
    });

    promise.finally(() => {
      if (get().current === item) {
        partial(({ modals }) => ({
          current: modals[modals.length - 2],
        }));

        setTimeout(() => {
          partial(({ modals }) => ({
            modals: modals.filter((exist) => exist !== item),
          }));
        }, 300);
      } else {
        partial(({ modals }) => ({
          modals: modals.filter((exist) => exist !== item),
        }));
      }
    });
    return promise;
  };
});

const useAsyncModal = store.createHook();

export const usePushAsyncModal = store.createHookAction();

export const AsyncModal = ({ children }: { children: ReactNode }) => {
  const [{ modals, current }] = useAsyncModal();

  return (
    <>
      {children}
      {modals.map((item) => {
        return (
          <Modal
            {...item.props}
            key={item.id}
            show={item === current}
            onHide={() => item.pop()}
          >
            {item.render(item.pop)}
          </Modal>
        );
      })}
    </>
  );
};
