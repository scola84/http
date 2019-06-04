import { Worker } from '@scola/worker';

export default class DateHeader extends Worker {
  constructor(methods) {
    super(methods);

    this._date = null;

    this.setDate();
    this.setInterval();
  }

  act(message, data, callback) {
    this.setHeader(message);
    this.pass(message, data, callback);
  }

  decide(message) {
    return typeof message.headers.Date === 'undefined';
  }

  err(message, data, callback) {
    this.setHeader(message);
    this.fail(message, data, callback);
  }

  setHeader(message) {
    message.headers.Date = this._date;
  }

  setDate() {
    this._date = new Date().toUTCString();
  }

  setInterval() {
    setInterval(() => this.setDate(), 1000);
  }
}
