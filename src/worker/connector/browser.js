import { Worker } from '@scola/worker';
import Request from '../message/request';

export default class BrowserConnector extends Worker {
  act(options, data, callback) {
    const request = new Request(options);

    if (typeof request.socket !== 'undefined') {
      this.pass(request, data, callback);
      return;
    }

    try {
      this.open(request, data, callback);
    } catch (error) {
      if (typeof error.data === 'undefined') {
        error.data = data;
      }

      this.fail(request, error, callback);
    }
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
