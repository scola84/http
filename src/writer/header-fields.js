import { Worker } from '@scola/worker';

export default class HeaderFieldsWriter extends Worker {
  act(message, data, callback) {
    data = this._write(message, data);
    this.pass(message, data, callback);
  }

  err(message, data, callback) {
    data = this._write(message, data);
    this.fail(message, data, callback);
  }

  decide(message) {
    return message.state.headers !== true;
  }

  _write(message, data) {
    const keys = Object.keys(message.headers);

    let headers = '';
    let key = '';

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      headers += key + ': ' + message.headers[key] + '\r\n';
    }

    if (data instanceof Buffer) {
      data = Buffer.concat([Buffer.from(headers + '\r\n'), Buffer.from(data)]);
    } else {
      data = headers + '\r\n' + data;
    }

    message.state.headers = true;

    return data;
  }
}
