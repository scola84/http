import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';

export class HtmlEncoder extends Worker {
  getType() {
    return 'text/html';
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
    data = data.encode();

    message.body.length = Buffer.byteLength(data);
    message.state.body = true;

    this.pass(message, data, callback);
  }
}
