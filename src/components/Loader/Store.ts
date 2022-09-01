import { Store } from "utils/Store";

export interface LoaderState {
  total: number;
  count: number;
}

const initialState: LoaderState = { total: 0, count: 0 };

const store = new Store(initialState, ({ get, set, partial }) => {
  return function <T = void>(promise: Promise<T>) {
    let { count, total } = get();

    if (count === total) count = total = 0;

    set({ count, total: total + 1 });

    const onDone = () => partial({ count: get().count + 1 });

    promise.then(onDone).catch(onDone);

    return promise;
  };
});

const loadingSelector = ({ count, total }: LoaderState) => count !== total;

export const useProgressLoader = store.createHook();

export const useLoading = store.createHook(loadingSelector);

export const usePushLoader = store.createHookAction();

export const LoaderContainer = store.createContainer();

export const LoaderSubscriber = store.createSubscriber(loadingSelector);
