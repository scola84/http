import { Streamer } from '@scola/worker';

export default class BodyWriter extends Streamer {
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
    if (data !== null) {
      this.write(message, data, callback);
    }

    if (message.state.body === true) {
      if (message.mustEnd()) {
        message.socket.removeAllListeners();
        message.socket.destroy();
      }
    }
  }
}
