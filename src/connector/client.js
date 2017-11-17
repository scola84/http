import { Worker } from '@scola/worker';
import net from 'net';
import tls from 'tls';
import Request from '../message/request';

export default class ClientConnector extends Worker {
  act(options, data) {
    const message = new Request(options);

    if (typeof message.socket === 'undefined') {
      message.socket = this._createSocket(message);
    }

    this.pass(message, data);
  }

  _createSocket(message) {
    message.headers.Host = message.formatHost();

    if (message.url.scheme === 'https') {
      return tls.connect(message.url.port, message.url.hostname,
        message.options);
    }

    return net.connect(message.url.port, message.url.hostname,
      message.options);
  }
}
