import { Worker } from '@scola/worker';
import { STATUS_CODES } from 'http';

export default class ResponseLineWriter extends Worker {
  act(message, data, callback) {
    data = this._write(message, data);
    this.pass(message, data, callback);
  }

  err(message, data, callback) {
    data = this._write(message, data);
    this.fail(message, data, callback);
  }

  decide(message) {
    return message.state.line !== true;
  }

  _write(message, data) {
    const line = 'HTTP/1.1 ' +
      (message.status || 200) + ' ' +
      STATUS_CODES[message.status || 200] +
      '\r\n';

    if (data instanceof Buffer) {
      data = Buffer.concat([Buffer.from(line), data]);
    } else {
      data = line + data;
    }

    message.state.line = true;

    return data;
  }
}
