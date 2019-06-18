import { Worker } from '@scola/worker';

export class ConnectionHeader extends Worker {
  act(message, data, callback) {
    this.setHeader(message);
    this.pass(message, data, callback);
  }

  decide(message) {
    return typeof message.headers.connection === 'undefined';
  }

  err(message, data, callback) {
    this.setHeader(message);
    this.fail(message, data, callback);
  }

  setHeader(message) {
    if (message.status) {
      this.setResponseHeader(message);
    } else {
      this.setRequestHeader(message);
    }
  }

  setRequestHeader(message) {
    message.headers.connection = 'keep-alive';
  }

  setResponseHeader(message) {
    message.headers.connection = 'close';

    if (
      message.protocol.version === '1.1' &&
      message.status === 200
    ) {
      message.headers.connection = 'keep-alive';
    }
  }
}
