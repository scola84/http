import { Worker } from '@scola/worker';

export default class BodyParser extends Worker {
  constructor(methods) {
    super(methods);
    this._maxLength = 1024 * 1024;
  }

  setMaxLength(maxLength) {
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

    if (contentLength > this._maxLength) {
      throw new Error('413 Content length exceeds maximum');
    }

    data = data.slice(message.parser.begin);
    message.body.length = (message.body.length || 0) + data.length;

    if (message.body.length > contentLength) {
      data = data.slice(0, contentLength - message.body.length);
      message.body.length = contentLength;
    }

    if (message.body.length === contentLength) {
      message.state.body = true;
    }

    if (message.body.length > this._maxLength) {
      throw new Error('413 Body length exceeds maximum');
    }

    if (data.length === 0) {
      data = {};
    }

    this.pass(message, data, callback);
  }

  decide(message) {
    return message.state.body !== true &&
      message.getHeader('Transfer-Encoding', '').indexOf('chunked') === -1;
  }
}
