import { Worker } from '@scola/worker';

export class ContentEncodingHeader extends Worker {
  constructor(methods) {
    super(methods);
    this._encodings = [];
  }

  addEncoding(encoding) {
    this._encodings.push(encoding);
    return this;
  }

  act(message, data, callback) {
    const acceptable = message
      .parseHeader('accept-encoding')
      .parseAcceptable('*');

    const preferred = message.headers['content-encoding'];
    const actual = [];

    let accept = null;
    let prefer = null;

    for (let i = 0; i < preferred.length; i += 1) {
      prefer = preferred[i];

      for (let j = 0; j < acceptable.length; j += 1) {
        if (acceptable[j].q === 0) {
          continue;
        }

        accept = acceptable[j][0];

        if (accept === '*' || prefer === accept) {
          actual.push(prefer);
          break;
        }
      }
    }

    message.body.content = actual;

    if (actual.length > 0) {
      message.headers['content-encoding'] = actual;
    } else {
      delete message.headers['content-encoding'];
    }

    this.pass(message, data, callback);
  }

  decide(message, data) {
    if (
      typeof data !== 'undefined' &&
      typeof message.headers['content-encoding'] !== 'undefined' &&
      typeof message.body.content === 'undefined'
    ) {
      return true;
    }

    return false;
  }
}
