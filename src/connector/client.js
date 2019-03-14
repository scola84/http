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
  static getOptions() {
    return woptions;
  }

  static setOptions(options) {
    merge(woptions, options);
  }

  act(options, data, callback) {
    defaults(options, {
      method: 'GET',
      retry: 0,
      timeout: 60000,
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
      this._connect(request, data, callback, options);
    } catch (error) {
      error.data = data;
      this.fail(request, error, callback);
    }
  }

  _connect(request, data, callback, options) {
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
      this.fail(request, error, callback);
    });

    socket.once('timeout', () => {
      request.socket = socket;
      this._timeout(request, data, callback, options);
    });

    socket.once(event, () => {
      request.socket = socket;
      this.pass(request, data, callback);
    });
  }

  _retry(request, data, callback, options) {
    if (request.socket) {
      request.socket.removeAllListeners();
      request.socket.destroy();
      delete request.socket;
    }

    if (request.retry === 0) {
      const error = new Error('Connection timed out');
      this.fail(request, error, callback);
      return;
    }

    options.retry -= 1;
    this.act(options, data, callback);
  }

  _timeout(request, data, callback, options) {
    try {
      this._retry(request, data, callback, options);
    } catch (error) {
      this.fail(request, error, callback);
    }
  }
}
