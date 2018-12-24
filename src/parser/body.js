import { Worker } from '@scola/worker';

export default class BodyParser extends Worker {
  constructor(options = {}) {
    super(options);

    this._maxLength = null;
    this.setMaxLength(options.maxLength);
  }

  setMaxLength(maxLength = -1) {
    this._maxLength = maxLength;
    return this;
  }

  act(message, data, callback) {
    let contentLength = message.getHeader('Content-Length');

    if (typeof contentLength !== 'undefined') {
      contentLength = Number(contentLength);

      if (Number.isNaN(contentLength)) {
        throw new Error('411 Invalid Content-Length header');
      }

      message.setHeader('Content-Length', contentLength);
    } else {
      contentLength = 0;
    }

    if (this._maxLength > -1) {
      if (contentLength > this._maxLength) {
        throw new Error('413 Content length exceeds maximum');
      }
    }

    data = data.slice(message.parser.begin);

    message.body.length = (message.body.length || 0) + data.length;
    message.parser.begin = 0;

    if (message.body.length > contentLength) {
      data = data.slice(0, contentLength - message.body.length);
      message.body.length = contentLength;
    }

    if (message.body.length === contentLength) {
      message.state.body = true;
    }

    if (this._maxLength > -1) {
      if (message.body.length > this._maxLength) {
        throw new Error('413 Body length exceeds maximum');
      }
    }

    if (data.length === 0) {
      data = '';
    }

    this.pass(message, data, callback);
  }

  decide(message, data) {
    return data !== null && message.state.body !== true &&
      message.getHeader('Transfer-Encoding', '').indexOf('chunked') === -1;
  }
}
