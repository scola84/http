import { Streamer } from '@scola/worker';
import { Request } from '../message';

export class ServerConnector extends Streamer {
  act(socket) {
    this.read({ socket });
  }

  data(box, data) {
    if (this._log === 'data') {
      console.log(String(data));
      console.log();
    }

    const create = typeof box.request === 'undefined' ||
      box.request.state.body === true &&
      box.request.state.headers === true &&
      box.request.state.line === true;

    if (create === true) {
      box.request = new Request({
        socket: box.socket
      });
    }

    data = this.prepareParser(box.request, data);

    this.pass(box.request, data, (bx, resume) => {
      this.throttle(box, resume);
    });
  }

  end() {}

  fail() {}

  stream(request) {
    return request.socket;
  }

  prepareParser(request, data) {
    if (request.parser.data) {
      data = Buffer.concat([request.parser.data, data]);
      request.parser.data = null;
    }

    if (typeof request.parser.length === 'undefined') {
      request.parser.length = null;
    }

    request.parser.begin = 0;
    request.parser.end = 0;

    return data;
  }
}
