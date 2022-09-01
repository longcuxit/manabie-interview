import { Dispatch, ReactNode, SetStateAction } from "react";

export type SetStatePartialAction<S, R = Partial<S>> =
  | R
  | ((prevState: Readonly<S>) => R);

export type StoreApi<State> = Readonly<{
  get: () => State;
  set: Dispatch<SetStateAction<State>>;
  partial: Dispatch<SetStatePartialAction<State>>;
}>;

export type ActionCreator<State, Action = any> = (
  api: StoreApi<State>
) => Action;

export interface StoreProps<State, Action = any> {
  name?: string;
  state: State;
  action: ActionCreator<State, Action>;
}

export type ContainerLifePoint<State, Action = any> = (
  api: StoreApi<State>,
  action: Action
) => void;

export type ContainerLifeCycle<State, Action = any> = {
  create?: ContainerLifePoint<State, Action>;
  update?: ContainerLifePoint<State, Action>;
  dispose?: ContainerLifePoint<State, Action>;
};

export type ContainerProps<State> = { state: State; children?: ReactNode };
export type SubscriberProps<Action, Value, T = Value> = {
  getter?: ValueGetter<Value, T>;
  children: (state: T, action: Action) => ReactNode;
};

export type ValueGetter<State, Value = State> = (state: State) => Value;

export type UseHook<State, Action, Value = State, G = Value> = (
  getter?: ValueGetter<Value, G>
) => [G, Action];

export type UseAction<Action> = () => Action;
