type Listener<T = void> = () => T;

export class Notifier {
  private _listens: Listener[] = [];

  get hasListen(): boolean {
    return Boolean(this._listens.length);
  }

  addListen(listener: Listener): () => void {
    const { _listens } = this;
    _listens.push(listener);
    return () => {
      _listens.splice(_listens.indexOf(listener), 1);
    };
  }

  onceListen(listener: Listener): () => void {
    const unListen = this.addListen(() => {
      unListen();
      listener();
    });
    return unListen;
  }

  whileListen(listener: Listener<boolean | void>): () => void {
    const unListen = this.addListen(() => {
      if (listener() === false) unListen();
    });
    return unListen;
  }

  protected notify(): void {
    this._listens.slice().forEach((listener) => listener());
  }

  dispose() {
    this._listens.length = 0;
  }
}

export class ValueChanged<V> extends Notifier {
  constructor(private _value: V) {
    super();
  }

  get value(): V {
    return this._value;
  }

  set value(value: V) {
    if (this._value === value) return;
    this._value = value;
    this.notify();
  }
}
