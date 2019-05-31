import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import defaults from 'lodash-es/defaultsDeep';

export default class BrowserMediator extends Worker {
  act(request, data, callback = () => {}) {
    this._handleProgress(request, data, callback);
    this._setHeaders(request);
    this._bind(request, data, callback);

    request.socket.send(data);
  }

  err(request, error, callback) {
    this.fail(request.createResponse(), error, callback);
  }

  _bind(request, data, callback) {
    request.socket.onerror = () => {
      this._handleError(request, data, callback);
    };

    request.socket.onload = () => {
      this._handleLoad(request, data, callback);
    };

    request.socket.onprogress = (event) => {
      this._handleProgress(request, data, callback, event);
    };

    request.socket.upload.onprogress = request.socket.onprogress;
  }

  _unbind(request) {
    request.socket.onerror = null;
    request.socket.onload = null;
    request.socket.onprogress = null;
    request.socket.upload.onprogress = null;
  }

  _handleError(request, data, callback) {
    this._handleProgress(request, data, callback, { total: 1 });
    this._unbind(request);

    const errorText = (request.socket.status ?
        request.socket.status + ' ' : '') +
      'Could not complete request';

    this.fail(
      request.createResponse(),
      new Error(errorText)
    );
  }

  _handleLoad(request, data, callback) {
    this._handleProgress(request, data, callback, { total: 1 });
    this._unbind(request);

    const responseHeaders = request.socket.getAllResponseHeaders();

    const responseData = 'HTTP/1.1 ' +
      request.socket.status + ' ' + request.socket.statusText + '\r\n' +
      responseHeaders +
      (responseHeaders.slice(-4) === '\r\n\r\n' ? '' : '\r\n') +
      request.socket.responseText;

    this.pass(
      request.createResponse(),
      Buffer.from(responseData),
      callback
    );
  }

  _handleProgress(request, data, callback, event = {}) {
    callback(defaults(event, {
      lengthComputable: true,
      loaded: 1,
      total: 10
    }));
  }

  _setHeaders(request) {
    const names = Object.keys(request.headers || {});
    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];

      if (request.headers[name] === 'multipart/form-data') {
        continue;
      }

      request.socket.setRequestHeader(name, request.headers[name]);
    }
  }
}
