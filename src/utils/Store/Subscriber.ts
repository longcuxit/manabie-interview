import { SetStateAction } from "react";
import { ValueChanged } from "./Notifier";
import { SetStatePartialAction, StoreApi } from "./type";

export class Subscriber<V, A> extends ValueChanged<V> {
  action: A;

  api = Object.freeze({
    get: (): V => this.value,
    set: (value: SetStateAction<V>): void => {
      if (value instanceof Function) this.value = value(this.value);
      else this.value = value;
    },
    partial: (value: SetStatePartialAction<V>): void => {
      let nextValue: Partial<V>;

      if (value instanceof Function) nextValue = value(this.value);
      else nextValue = value;

      const changed = Object.keys(nextValue).find((key) => {
        return nextValue[key] !== this.value[key];
      });

      if (!changed) return;

      this.value = { ...this.value, ...nextValue };
    },
  });

  constructor(value: V, createAction: (api: StoreApi<V>) => A) {
    super(value);
    this.action = createAction(this.api);
  }
}
