import { Worker } from '@scola/worker';
import net from 'net';
import tls from 'tls';
import Request from '../message/request';

export default class ClientConnector extends Worker {
  constructor(options = {}) {
    options.err = options.err || ((message, error) => {
      this.log('error', message, error);
    });

    super(options);
  }

  act(options, data, callback) {
    const message = new Request(options);

    if (typeof message.socket === 'undefined') {
      this._connect(message, data, callback);
    } else {
      this.pass(message, data, callback);
    }
  }

  _connect(message, data, callback) {
    const library = message.url.scheme === 'http' ? net : tls;
    const event = library === net ? 'connect' : 'secureConnect';

    message.headers.Host = message.formatHost();

    const socket = library.connect(Object.assign({
      host: message.url.hostname,
      port: message.url.port || 443,
      servername: message.url.hostname
    }, message.options));

    socket.once('error', (error) => {
      this.err(message, error, callback);
    });

    socket.once(event, () => {
      message.socket = socket;
      this.pass(message, data, callback);
    });
  }
}
