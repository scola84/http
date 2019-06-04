import { Worker } from '@scola/worker';

export default class HeaderFieldsWriter extends Worker {
  act(message, data, callback) {
    data = this.writeData(message, data);
    this.pass(message, data, callback);
  }

  err(message, data, callback) {
    data = this.writeData(message, data);
    this.fail(message, data, callback);
  }

  decide(message) {
    return message.state.headers !== true;
  }

  isEmpty(data) {
    return typeof data === 'undefined' || data === null;
  }

  writeData(message, data) {
    const headers = message.formatHeaders();

    if (data instanceof Buffer) {
      data = Buffer.concat([
        Buffer.from(headers + '\r\n'),
        Buffer.from(data)
      ]);
    } else {
      data = headers + '\r\n' + (this.isEmpty(data) ? '' : data);
    }

    message.state.headers = true;

    return data;
  }
}
