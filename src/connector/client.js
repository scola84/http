import { Worker } from '@scola/worker';
import net from 'net';
import tls from 'tls';
import Request from '../message/request';

export default class ClientConnector extends Worker {
  act(options, data, callback) {
    const request = new Request(options);

    if (typeof request.socket === 'undefined') {
      this._connect(request, data, callback);
    } else {
      this.pass(request, data, callback);
    }
  }

  _connect(request, data, callback) {
    const library = request.url.scheme === 'http' ? net : tls;
    const event = library === net ? 'connect' : 'secureConnect';

    request.headers.Host = request.formatHost();

    const socket = library.connect(Object.assign({
      host: request.url.hostname,
      port: request.url.port || 443,
      servername: request.url.hostname
    }, request.options));

    socket.once('error', (error) => {
      this.fail(request.createResponse(), error, callback);
    });

    socket.once(event, () => {
      request.socket = socket;
      this.pass(request, data, callback);
    });
  }
}
