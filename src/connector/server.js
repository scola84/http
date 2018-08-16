import { Streamer } from '@scola/worker';
import Request from '../message/request';

export default class ServerConnector extends Streamer {
  act(socket) {
    this.read({ socket });
  }

  data(box, data) {
    if (this._log === 'data') {
      console.log(String(data));
      console.log();
    }

    const create = typeof box.message === 'undefined' ||
      box.message.state.body === true &&
      box.message.state.headers === true &&
      box.message.state.line === true;

    if (create === true) {
      box.message = new Request({ socket: box.socket });
    }

    data = this._prepareParser(box.message, data);

    this.pass(box.message, data, (bx, resume) => {
      this.throttle(box, resume);
    });
  }

  end() {}

  fail() {}

  stream(box) {
    return box.socket;
  }

  _prepareParser(message, data) {
    if (message.parser.data) {
      data = Buffer.concat([message.parser.data, data]);
      message.parser.data = null;
    }

    if (typeof message.parser.length === 'undefined') {
      message.parser.length = null;
    }

    message.parser.begin = 0;
    message.parser.end = 0;

    return data;
  }
}
