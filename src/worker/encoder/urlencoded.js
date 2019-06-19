import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import qs from 'qs';

export class UrlencodedEncoder extends Worker {
  getType() {
    return 'application/x-www-form-urlencoded';
  }

  act(message, data, callback) {
    try {
      this.encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  decide(message) {
    return message.state.body !== true &&
      message.body.dataType !== this.getType();
  }

  encode(message, data, callback) {
    data = qs.stringify(data);

    message.body.length = Buffer.byteLength(data);
    message.state.body = true;

    this.pass(message, data, callback);
  }
}
