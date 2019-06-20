import { Worker } from '@scola/worker';

export class RequestLineWriter extends Worker {
  act(message, data, callback) {
    data = message.method + ' ' +
      message.formatPath() + ' HTTP/1.1' +
      '\r\n' +
      data;

    message.state.line = true;

    this.pass(message, data, callback);
  }

  decide(message) {
    return message.state.line !== true;
  }
}
