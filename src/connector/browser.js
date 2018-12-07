import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import Request from '../message/request';

export default class BrowserConnector extends Worker {
  act(options, data, callback) {
    defaults(options, {
      method: 'GET',
      url: {
        hostname: window.location.hostname,
        port: options.url.scheme === 'http' ? 80 : 443,
        scheme: 'https'
      }
    });

    const message = new Request(options);

    if (typeof message.socket === 'undefined') {
      message.socket = this._createSocket(message);
    }

    this.pass(message, data, callback);
  }

  _createSocket(message) {
    const socket = new XMLHttpRequest();

    socket.open(message.method, message.formatUrl());

    return socket;
  }
}
