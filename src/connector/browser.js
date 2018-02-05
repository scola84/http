import { Worker } from '@scola/worker';
import Request from '../message/request';

export default class BrowserConnector extends Worker {
  act(options, data, callback) {
    const message = new Request(options);

    if (typeof message.socket === 'undefined') {
      message.socket = this._createSocket(message);
    }

    this.pass(message, data, callback);
  }

  _createSocket(message) {
    const socket = new XMLHttpRequest();

    socket.open(message.method || 'GET',
      message.formatUrl(window.location));

    return socket;
  }
}
