import {
  Context,
  createContext,
  createElement,
  FC,
  Fragment,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  HookSelector,
  ContainerLifeCycle,
  ContainerLifePoint,
  ActionCreator,
} from "./type";
import { Subscriber } from "./Subscriber";

const getName = (sub: string, name = "SweetStore") => `${name}.${sub}`;

export class Store<State, Action> {
  private Context: Context<Subscriber<State, Action>>;

  constructor(
    state: State,
    private createAction: ActionCreator<State, Action>,
    displayName?: string
  ) {
    this.Context = createContext(new Subscriber(state, this.createAction));
    this.Context.displayName = displayName;
  }

  createContainer(cycle: ContainerLifeCycle<State, Action> = {}) {
    const { Context, createAction } = this;
    type Props = { state: State; children?: ReactNode };

    const firePoint = (
      store: Subscriber<State, Action>,
      fire?: ContainerLifePoint<State, Action>
    ) => fire && fire(store.api, store.action);

    const Container: FC<Props> = ({ children, state }) => {
      const [store] = useState(() => new Subscriber(state, createAction));

      useEffect(() => {
        firePoint(store, cycle.create);
        return () => firePoint(store, cycle.dispose);
      }, [store]);

      useEffect(() => {
        if (store.value !== state) {
          store.value = state;
          firePoint(store, cycle.update);
        }
      }, [state, store]);

      return createElement(Context.Provider, { value: store, children });
    };

    Container.displayName = getName("Container", this.Context.displayName);
    return Container;
  }

  createSubscriber<Value = State>(selector?: HookSelector<State, Value>) {
    const useHook = this.createHook(selector);
    type Props = {
      children: (state: Value, action: Action) => ReactNode;
    };

    const Subscriber: FC<Props> = ({ children }) => {
      const [state, action] = useHook();
      return createElement(Fragment, { children: children(state, action) });
    };
    Subscriber.displayName = getName("Subscriber", this.Context.displayName);

    return Subscriber;
  }

  createHook<Value = State, Flags extends any[] = never>(
    selector?: HookSelector<State, Value, Flags>
  ) {
    type Select = (state: State, ...flags: Flags) => Value;
    const select = (selector || ((v) => v)) as Select;

    return (...flags: Flags): [Value, Action] => {
      const subscriber = useContext(this.Context);
      const [state, setState] = useState(() =>
        select(subscriber.value, ...flags)
      );

      useEffect(() => {
        setState(select(subscriber.value, ...flags));

        return subscriber.addListen(() => {
          setState(select(subscriber.value, ...flags));
        });
        // eslint-disable-next-line
      }, [subscriber, ...flags]);

      return [state, subscriber.action];
    };
  }

  createHookAction() {
    return () => useContext(this.Context).action;
  }
}
