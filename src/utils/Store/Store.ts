import {
  Component,
  Context,
  createContext,
  createElement,
  Fragment,
  useContext,
  useSyncExternalStore,
} from "react";

import {
  ContainerLifeCycle,
  ContainerLifePoint,
  ActionCreator,
  ContainerProps,
  SubscriberProps,
  UseAction,
  ValueGetter,
} from "./type";
import { Subscriber } from "./Subscriber";

const getName = (sub: string, name: string) => `${name}.${sub}`;

function createSelector<S, V = S>(selector?: ValueGetter<S, V>) {
  if (!selector) selector = (state) => state as any;
  return function <T = V>(state: S, getter?: ValueGetter<V, T>): T {
    const value = selector!(state);
    return getter ? getter(value) : (value as any);
  };
}

export class Store<State, Action> {
  Context: Context<Subscriber<State, Action>>;

  constructor(
    state: State,
    private createAction: ActionCreator<State, Action>,
    displayName?: string
  ) {
    this.Context = createContext(new Subscriber(state, this.createAction));
    this.Context.displayName = displayName || "SweetStore";
  }

  createContainer<Props extends ContainerProps<State>>(
    cycle: ContainerLifeCycle<State, Action> = {}
  ) {
    const { Context, createAction } = this;

    const firePoint = (
      store: Subscriber<State, Action>,
      fire?: ContainerLifePoint<State, Action>
    ) => fire && fire(store.api, store.action);

    class Container extends Component<Props> {
      static displayName = getName("Container", Context.displayName!);

      store: Subscriber<State, Action>;

      constructor(props: Props) {
        super(props);
        this.store = new Subscriber(props.state, createAction);
        firePoint(this.store, cycle.create);
      }

      shouldComponentUpdate(props: Props) {
        if (this.props.state !== props.state) {
          this.store.api.set(props.state);
          firePoint(this.store, cycle.update);
        }
        return true;
      }

      componentWillUnmount() {
        firePoint(this.store, cycle.dispose);
        this.store.dispose();
      }

      render() {
        return createElement(Context.Provider, {
          value: this.store,
          children: this.props.children,
        });
      }
    }

    return Container;
  }

  createSubscriber<Value = State>(selector?: ValueGetter<State, Value>) {
    const { Context } = this;

    type Props<T> = SubscriberProps<Action, Value, T>;
    const useStore = this.createHook(selector);

    function StoreSubscriber<T = Value>(props: Props<T>): JSX.Element {
      const [state, action] = useStore(props.getter);
      return createElement(Fragment, {
        children: props.children(state, action),
      });
    }

    return Object.assign(StoreSubscriber, {
      displayName: getName("Subscriber", Context.displayName!),
    });
  }

  createHook<Value = State>(selector?: ValueGetter<State, Value>) {
    const select = createSelector(selector);
    const { Context } = this;

    return function <T = Value>(getter?: ValueGetter<Value, T>): [T, Action] {
      const subscriber = useContext(Context);
      const state = useSyncExternalStore(
        subscriber.addListen.bind(subscriber),
        () => select(subscriber.value, getter)
      );

      return [state, subscriber.action];
    };
  }

  createHookAction(): UseAction<Action> {
    return () => useContext(this.Context).action;
  }
}
