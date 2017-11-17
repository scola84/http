import { Streamer } from '@scola/worker';

export default class BodyWriter extends Streamer {
  act(message, data, callback) {
    this._write(message, data, callback);
    this.pass(message, data, callback);
  }

  err(message, data, callback) {
    this._write(message, data, callback);
    this.fail(message, data, callback);
  }

  stream(message) {
    return message.socket;
  }

  _write(message, data, callback) {
    this.write(message, data, callback);

    if (message.state.body === true) {
      if (message.headers.Connection === 'close') {
        message.socket.end();
      }
    }
  }
}
