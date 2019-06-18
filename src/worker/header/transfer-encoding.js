import { Worker } from '@scola/worker';

export class TransferEncodingHeader extends Worker {
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
      .parseHeader('TE')
      .parseAcceptable('*');

    const preferred = message.headers['transfer-encoding'];
    const actual = [];

    let accept = null;
    let prefer = null;

    for (let i = 0; i < preferred.length; i += 1) {
      prefer = preferred[i];

      if (prefer === 'chunked') {
        actual.push(prefer);
        continue;
      }

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

    message.body.transfer = actual;

    if (actual.length > 0) {
      message.headers['transfer-encoding'] = actual;
    } else {
      delete message.headers['transfer-encoding'];
    }

    this.pass(message, data, callback);
  }

  decide(message, data) {
    if (
      typeof data !== 'undefined' &&
      typeof message.headers['transfer-encoding'] !== 'undefined' &&
      typeof message.body.transfer === 'undefined'
    ) {
      return true;
    }

    return false;
  }
}
