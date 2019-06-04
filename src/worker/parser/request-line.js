import { Worker } from '@scola/worker';

export default class RequestLineParser extends Worker {
  constructor(options = {}) {
    super(options);

    this._maxLength = null;
    this.setMaxLength(options.maxLength);
  }

  setMaxLength(maxLength = 8 * 1024) {
    this._maxLength = maxLength;
    return this;
  }

  act(message, data, callback) {
    for (; message.parser.end < data.length; message.parser.end += 1) {
      if (message.state.line === true) {
        break;
      }

      this.processCode(message, data);
    }

    if (message.state.line === true) {
      this.pass(message, data, callback);
    } else {
      message.parser.data = data.slice(message.parser.begin);
    }
  }

  decide(message) {
    return message.state.line !== true;
  }

  processCode(message, data) {
    message.parser.length = (message.parser.length || 0) + 1;

    if (message.parser.length > this._maxLength) {
      throw new Error('413 Header length exceeds maximum');
    }

    const code = data[message.parser.end];

    if (code === 32) {
      this.processSpace(message, data);
    } else if (code === 47) {
      this.processSlash(message, data);
    } else if (code === 10) {
      this.processLineFeed(message, data);
    }
  }

  processLineFeed(message, data) {
    this.processProtocolVersion(message, data);
    message.state.line = true;
  }

  processMethod(message, data) {
    message.method = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end
    );

    message.parser.begin = message.parser.end + 1;
  }

  processProtocolName(message, data) {
    message.protocol.name = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end
    );

    message.parser.begin = message.parser.end + 1;
  }

  processProtocolVersion(message, data) {
    message.protocol.version = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end - 1
    );

    message.parser.begin = message.parser.end + 1;
  }

  processSlash(message, data) {
    if (typeof message.url === 'string') {
      this.processProtocolName(message, data);
    }
  }

  processSpace(message, data) {
    if (typeof message.method !== 'string') {
      this.processMethod(message, data);
    } else if (typeof message.url !== 'string') {
      this.processUrl(message, data);
    }
  }

  processUrl(message, data) {
    message.url = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end
    );

    message.parser.begin = message.parser.end + 1;
  }
}
