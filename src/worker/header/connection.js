import { Worker } from '@scola/worker';

export default class ConnectionHeader extends Worker {
  act(message, data, callback) {
    this._setHeader(message);
    this.pass(message, data, callback);
  }

  decide(message) {
    return typeof message.headers.Connection === 'undefined';
  }

  err(message, data, callback) {
    this._setHeader(message);
    this.fail(message, data, callback);
  }

  _setHeader(message) {
    if (message.status) {
      this._setResponseHeader(message);
    } else {
      this._setRequestHeader(message);
    }
  }

  _setRequestHeader(message) {
    message.headers.Connection = 'keep-alive';
  }

  _setResponseHeader(message) {
    message.headers.Connection = 'close';

    if (
      message.protocol.version === '1.1' &&
      message.status === 200
    ) {
      message.headers.Connection = 'keep-alive';
    }
  }
}
