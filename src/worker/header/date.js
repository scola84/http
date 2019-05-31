import { Worker } from '@scola/worker';

export default class DateHeader extends Worker {
  constructor(methods) {
    super(methods);

    this._date = null;

    this._setDate();
    this._setInterval();
  }

  act(message, data, callback) {
    this._setHeader(message);
    this.pass(message, data, callback);
  }

  decide(message) {
    return typeof message.headers.Date === 'undefined';
  }

  err(message, data, callback) {
    this._setHeader(message);
    this.fail(message, data, callback);
  }

  _setHeader(message) {
    message.headers.Date = this._date;
  }

  _setDate() {
    this._date = new Date().toUTCString();
  }

  _setInterval() {
    setInterval(() => this._setDate(), 1000);
  }
}
