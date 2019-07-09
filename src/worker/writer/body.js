import { Streamer } from '@scola/worker';
import { Buffer } from 'buffer/';

export class BodyWriter extends Streamer {
  act(message, data, callback) {
    this.writeData(message, data, callback);
    this.pass(message, data, callback);
  }

  err(message, data, callback) {
    this.writeData(message, data, callback);
    this.fail(message, data, callback);
  }

  stream(message) {
    return message.socket;
  }

  writeData(message, data, callback) {
    if (
      Buffer.isBuffer(data) ||
      typeof data === 'string'
    ) {
      this.write(message, data, callback);
    }

    if (message.state.body === true) {
      if (message.mustEnd()) {
        message.end();
      }
    }
  }
}
