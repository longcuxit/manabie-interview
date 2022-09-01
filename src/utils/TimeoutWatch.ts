import { Notifier } from "./Store";

export class TimeoutWatch extends Notifier {
  private _duration = 0;
  private _startTime = 0;
  private _timeout: NodeJS.Timeout | null = null;

  get duration() {
    if (!this.running) return this._duration;
    return this._duration - (Date.now() - this._startTime);
  }

  get running() {
    return Boolean(this._timeout && this._duration);
  }

  pause() {
    if (!this._timeout) return;
    this._duration = this.duration;
    clearTimeout(this._timeout);
    this._timeout = null;
    this.notify();
    return this;
  }

  play(duration?: number) {
    if (this._timeout && !duration) return this;

    clearTimeout(this._timeout!);
    this._duration = duration || this._duration;
    this._startTime = Date.now();
    this._timeout = setTimeout(this.finish.bind(this), this._duration);
    this.notify();
    return this;
  }

  finish() {
    if (!this.running) return this;
    clearTimeout(this._timeout!);
    this._timeout = null;
    this._duration = 0;
    this.notify();
    return this;
  }
}
