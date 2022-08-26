import { Store } from "utils/Store";

interface LoaderState {
  total: number;
  count: number;
}

const initialState: LoaderState = { total: 0, count: 0 };

const store = new Store(initialState, ({ set }) => {
  return function <T = void>(promise: Promise<T>) {
    (async () => {
      set((state) => {
        if (state.count === state.total) {
          state.count = state.total = 0;
        }
        return { ...state, total: state.total + 1 };
      });

      try {
        await promise;
      } catch (_) {}

      set((state) => {
        return { ...state, count: state.count + 1 };
      });
    })();

    return promise;
  };
});

export const useProgressLoader = store.createHook();

export const useLoading = store.createHook(
  ({ count, total }) => count !== total
);

export const usePushLoader = store.createHookAction();

export const LoaderContainer = store.createContainer();
export const LoaderSubscriber = store.createSubscriber(
  ({ count, total }) => count !== total
);
