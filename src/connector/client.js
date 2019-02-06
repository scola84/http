import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import merge from 'lodash-es/merge';
import net from 'net';
import tls from 'tls';
import Request from '../message/request';

const woptions = {
  agent: null,
  net,
  tls
};

export default class ClientConnector extends Worker {
  static setOptions(options) {
    merge(woptions, options);
  }

  act(options, data, callback) {
    defaults(options, {
      method: 'GET',
      timeout: 30000,
      url: {
        port: options.url.scheme === 'http' ? 80 : 443,
        scheme: 'https'
      }
    });

    const request = new Request(options);
    request.setHeader('User-Agent', woptions.agent);

    if (typeof request.socket !== 'undefined') {
      this.pass(request, data, callback);
      return;
    }

    try {
      this._connect(request, data, callback);
    } catch (error) {
      error.data = data;
      this.fail(request, error, callback);
    }
  }

  _connect(request, data, callback) {
    const library = request.url.scheme === 'http' ?
      woptions.net : woptions.tls;

    const event = library === woptions.net ?
      'connect' : 'secureConnect';

    request.headers.Host = request.formatHost();

    const socket = library.connect(Object.assign({
      host: request.url.hostname,
      port: request.url.port,
      servername: request.url.hostname,
      timeout: request.timeout
    }, request.options));

    socket.once('error', (error) => {
      this.fail(request.createResponse(), error, callback);
      socket.removeAllListeners();
    });

    socket.once('timeout', () => {
      const error = new Error('Connection timed out');
      this.fail(request.createResponse(), error, callback);
      socket.removeAllListeners();
      socket.destroy();
    });

    socket.once(event, () => {
      request.socket = socket;
      this.pass(request, data, callback);
    });
  }
}
