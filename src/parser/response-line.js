import { Worker } from '@scola/worker';

export default class ResponseLineParser extends Worker {
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
    if (data.length === 0) {
      throw new Error('Empty reply from server');
    }

    for (; message.parser.end < data.length; message.parser.end += 1) {
      if (message.state.line === true) {
        break;
      }

      this._processCode(message, data);
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

  _processCode(message, data) {
    message.parser.length = (message.parser.length || 0) + 1;

    if (message.parser.length > this._maxLength) {
      throw new Error('413 Header length exceeds maximum');
    }

    const code = data[message.parser.end];

    if (code === 32) {
      this._processSpace(message, data);
    } else if (code === 47) {
      this._processSlash(message, data);
    } else if (code === 10) {
      this._processLineFeed(message, data);
    }
  }

  _processLineFeed(message) {
    message.parser.begin = message.parser.end + 1;
    message.state.line = true;
  }

  _processProtocolName(message, data) {
    message.protocol.name = data.toString('utf-8',
      message.parser.begin, message.parser.end);
    message.parser.begin = message.parser.end + 1;
  }

  _processProtocolVersion(message, data) {
    message.protocol.version = data.toString('utf-8',
      message.parser.begin, message.parser.end);
    message.parser.begin = message.parser.end + 1;
  }

  _processSlash(message, data) {
    if (typeof message.protocol.name !== 'string') {
      this._processProtocolName(message, data);
    }
  }

  _processSpace(message, data) {
    if (typeof message.protocol.version !== 'string') {
      this._processProtocolVersion(message, data);
    } else if (typeof message.status !== 'number') {
      this._processStatus(message, data);
    }
  }

  _processStatus(message, data) {
    message.status = Number(data.toString('utf-8',
      message.parser.begin, message.parser.end));
    message.parser.begin = message.parser.end + 1;
  }
}
