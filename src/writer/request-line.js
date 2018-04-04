import { Worker } from '@scola/worker';

export default class RequestLineWriter extends Worker {
  act(message, data, callback) {
    data = message.method + ' ' +
      message.formatRelativeUrl() + ' HTTP/1.1' +
      '\r\n' +
      data;

    message.state.line = true;

    this.pass(message, data, callback);
  }

  decide(message) {
    return message.state.line !== true;
  }
}
