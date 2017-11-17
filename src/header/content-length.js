import { Worker } from '@scola/worker';

export default class ContentLengthHeader extends Worker {
  act(message, data, callback) {
    this._setHeader(message, data);
    this.pass(message, data, callback);
  }

  decide(message) {
    if (typeof message.headers['Content-Length'] !== 'undefined') {
      return false;
    }

    return message
      .getHeader('Transfer-Encoding', '').indexOf('chunked') === -1;
  }

  err(message, data, callback) {
    this._setHeader(message, data);
    this.fail(message, data, callback);
  }

  _setHeader(message, data) {
    message.headers['Content-Length'] = message.body.length ||
      (data && data.length) ||
      0;
  }
}
