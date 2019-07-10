import { Worker } from '@scola/worker';
import { Request } from '../../object';

export class BrowserConnector extends Worker {
  act(options, data, callback) {
    const request = new Request(options);

    if (typeof request.socket !== 'undefined') {
      this.pass(request, data, callback);
      return;
    }

    try {
      this.open(request, data, callback);
    } catch (error) {
      this.fail(request, error, callback);
    }
  }

  err(box, error, callback) {
    this.fail(new Request(), error, callback);
  }

  open(request, data, callback) {
    request.socket = new XMLHttpRequest();
    request.socket.removeAllListeners = () => {};
    request.socket.destroy = () => {};

    request.socket.open(
      request.method,
      request.url.format()
    );

    this.pass(request, data, callback);
  }
}
