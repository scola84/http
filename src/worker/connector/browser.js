import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import merge from 'lodash-es/merge';
import Request from '../message/request';

const woptions = {};

export default class BrowserConnector extends Worker {
  static getOptions() {
    return woptions;
  }

  static setOptions(options) {
    merge(woptions, options);
  }

  act(options, data, callback) {
    defaults(options, woptions, {
      method: 'GET',
      url: {
        hostname: window.location.hostname,
        port: options.url.scheme === 'http' ? 80 : 443,
        scheme: 'https'
      }
    });

    const request = new Request(options);

    if (typeof request.socket !== 'undefined') {
      this.pass(request, data, callback);
      return;
    }

    try {
      this.open(request, data, callback);
    } catch (error) {
      error.data = data;
      this.fail(request, error, callback);
    }
  }

  open(request, data, callback) {
    request.socket = new XMLHttpRequest();
    request.socket.removeAllListeners = () => {};
    request.socket.destroy = () => {};

    request.socket.open(
      request.method,
      request.formatUrl()
    );

    this.pass(request, data, callback);
  }
}
