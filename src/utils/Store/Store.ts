import {
  Context,
  createContext,
  createElement,
  FC,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  HookSelector,
  ContainerLifeCycle,
  ContainerLifePoint,
  ActionCreator,
  ContainerProps,
  HookSelect,
  SubscriberProps,
  UseAction,
  UseHook,
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

  createContainer<Props extends ContainerProps<State>>(
    cycle: ContainerLifeCycle<State, Action> = {}
  ): FC<Props> {
    const { Context, createAction } = this;

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

  createSubscriber<Props extends SubscriberProps<Value, Action>, Value = State>(
    selector?: HookSelector<State, Value>
  ): FC<Props> {
    const useHook = this.createHook(selector);

    const Subscriber: FC<Props> = ({ children }) => {
      const [state, action] = useHook();
      return createElement(Fragment, { children: children(state, action) });
    };
    Subscriber.displayName = getName("Subscriber", this.Context.displayName);

    return Subscriber;
  }

  createHook<
    Select extends HookSelect<State, Flags, Value>,
    Value = State,
    Flags extends any[] = never
  >(
    selector?: HookSelector<State, Value, Flags>
  ): UseHook<Flags, Value, Action> {
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

  createHookAction(): UseAction<Action> {
    return () => useContext(this.Context).action;
  }
}
