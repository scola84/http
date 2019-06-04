import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';

export default class ContentLengthHeader extends Worker {
  act(message, data, callback) {
    this.setHeader(message, data);
    this.pass(message, data, callback);
  }

  decide(message) {
    if (typeof message.headers['Content-Length'] !== 'undefined') {
      return false;
    }

    return message
      .getHeader('Transfer-Encoding', '')
      .indexOf('chunked') === -1;
  }

  err(message, data, callback) {
    this.setHeader(message, data);
    this.fail(message, data, callback);
  }

  setHeader(message, data) {
    message.headers['Content-Length'] =
      message.body.length ||
      (data && Buffer.byteLength(data)) ||
      0;
  }
}
