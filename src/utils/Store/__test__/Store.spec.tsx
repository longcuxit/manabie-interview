import {
  fireEvent,
  render,
  renderHook,
  act,
  screen,
} from "@testing-library/react";

import { Store } from "../Store";

describe("utils/store/Store:", () => {
  const createStore = () => {
    const store = new Store(0, ({ set, get }) => () => {
      set(get() + 1);
    });

    const useHook = store.createHook();

    const useActions = store.createHookAction();

    const Subscriber = store.createSubscriber();

    const Container = store.createContainer();

    return { store, useHook, useActions, Subscriber, Container };
  };

  it("should hook change state", () => {
    const { useHook } = createStore();
    const { result } = renderHook(useHook);

    expect(result.current[0]).toBe(0);
    act(result.current[1]);
    expect(result.current[0]).toBe(1);
  });

  it("should container create new instance store", () => {
    const { useHook, Container } = createStore();
    const { result: globalIns } = renderHook(useHook);

    expect(globalIns.current[0]).toBe(0);
    act(globalIns.current[1]);
    expect(globalIns.current[0]).toBe(1);

    const { result: scopeIns } = renderHook(useHook, {
      wrapper: ({ children }) => <Container state={10}>{children}</Container>,
    });

    expect(scopeIns.current[0]).toBe(10);
    act(scopeIns.current[1]);
    expect(scopeIns.current[0]).toBe(11);

    expect(globalIns.current[0]).toBe(1);
  });

  it("should container fire cycle", () => {
    const { store } = createStore();

    const cycle = { create: jest.fn(), update: jest.fn(), dispose: jest.fn() };
    const Container = store.createContainer(cycle);

    const tree = render(<Container state={10} />);

    expect(cycle.create).toBeCalledTimes(1);
    expect(cycle.update).toBeCalledTimes(0);
    expect(cycle.dispose).toBeCalledTimes(0);

    tree.rerender(<Container state={11} />);
    expect(cycle.create).toBeCalledTimes(1);
    expect(cycle.update).toBeCalledTimes(1);
    expect(cycle.dispose).toBeCalledTimes(0);

    tree.rerender(<Container state={12} />);
    expect(cycle.create).toBeCalledTimes(1);
    expect(cycle.update).toBeCalledTimes(2);
    expect(cycle.dispose).toBeCalledTimes(0);

    tree.unmount();
    expect(cycle.create).toBeCalledTimes(1);
    expect(cycle.update).toBeCalledTimes(2);
    expect(cycle.dispose).toBeCalledTimes(1);
  });

  it("should don't rerender when change state by hook action", () => {
    const { useActions } = createStore();
    const countRender = jest.fn();
    const { result } = renderHook(() => {
      countRender();
      return useActions();
    });

    act(result.current);

    expect(countRender).toBeCalledTimes(1);
  });

  it("should Subscriber change state", () => {
    const { useActions, Subscriber } = createStore();

    const renderSubscriber = jest.fn();

    const { result } = renderHook(useActions, {
      wrapper({ children }) {
        return (
          <>
            {children}
            <Subscriber children={(num) => renderSubscriber(num)} />
          </>
        );
      },
    });

    expect(renderSubscriber).lastCalledWith(0);

    act(result.current);

    expect(renderSubscriber).lastCalledWith(1);
  });
});
