import { Worker } from '@scola/worker';

export class ChunkedDecoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._maxLength = null;
    this.setMaxLength(options.maxLength);
  }

  getMaxLength() {
    return this._maxLength;
  }

  setMaxLength(maxLength = 1024 * 1024) {
    this._maxLength = maxLength;
    return this;
  }

  getEncoding() {
    return 'chunked';
  }

  act(message, data, callback) {
    let begin = message.parser.begin;
    let i = begin;

    for (; i < data.length; i += 1) {
      if (data[i] === 13) {
        if (message.state.body !== true && message.parser.length === null) {
          [begin, i] = this.parseLength(message, data, callback, begin, i);
        } else {
          [begin, i] = this.parsePartial(message, data, callback, begin, i);
        }
      }
    }

    if (begin < i || message.parser.length === null) {
      this.parseComplete(message, data, callback, begin, i);
    }

    message.parser.begin = 0;
  }

  decide(message, data) {
    return data !== null &&
      message.state.body !== true &&
      message.state.headers === true;
  }

  parseComplete(message, data, callback, begin, i) {
    if (i - begin === 1 && Number(data.slice(begin, i)) === 0) {
      this.parseLength(message, data, callback, begin, i);
      return;
    }

    this.pass(message, data.slice(begin, i), callback);

    message.parser.sliced = (message.parser.sliced || 0) +
      data.slice(begin, i).length;
  }

  parseLength(message, data, callback, begin, i) {
    message.parser.length = parseInt(data.slice(begin, i), 16);
    message.parser.sliced = 0;

    if (Number.isNaN(message.parser.length)) {
      throw new Error('Chunked data is corrupt');
    }

    begin = i + 2;
    i = begin - 2 + message.parser.length;

    return [begin, i];
  }

  parsePartial(message, data, callback, begin, i) {
    if (message.parser.length !== 0) {
      this.pass(message, data.slice(begin, i), callback);
    }

    message.state.body = message.parser.length === 0;

    message.parser.length = null;
    message.parser.sliced = (message.parser.sliced || 0) +
      data.slice(begin, i).length;

    begin = i + 2;

    return [begin, i];
  }
}
