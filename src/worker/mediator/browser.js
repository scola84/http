import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import defaults from 'lodash-es/defaultsDeep';

export class BrowserMediator extends Worker {
  act(request, data, callback = () => {}) {
    this.handleProgress(request, data, callback);
    this.bindSocket(request, data, callback);
    this.setHeaders(request);

    request.socket.send(data);
  }

  err(request, error, callback) {
    this.fail(request.createResponse(), error, callback);
  }

  bindSocket(request, data, callback) {
    request.socket.onerror = () => {
      this.handleError(request, data, callback);
    };

    request.socket.onload = () => {
      this.handleLoad(request, data, callback);
    };

    request.socket.onprogress = (event) => {
      this.handleProgress(request, data, callback, event);
    };

    request.socket.upload.onprogress = request.socket.onprogress;
  }

  unbindSocket(request) {
    request.socket.onerror = null;
    request.socket.onload = null;
    request.socket.onprogress = null;
    request.socket.upload.onprogress = null;
  }

  handleError(request, data, callback) {
    this.handleProgress(request, data, callback, { total: 1 });
    this.unbindSocket(request);

    const response = request.createResponse();
    response.status = request.socket.status;

    const error = new Error(
      (request.socket.status ? request.socket.status + ' ' : '') +
      'Could not complete request'
    );

    this.fail(response, error);
  }

  handleLoad(request, data, callback) {
    this.handleProgress(request, data, callback, { total: 1 });
    this.unbindSocket(request);

    const responseText = request.socket.responseText;
    let responseHeaders = request.socket.getAllResponseHeaders();

    if (responseHeaders.match('content-length') === null) {
      responseHeaders = responseHeaders
        .replace(/(content|transfer)-encoding.+\r\n/g, '');

      responseHeaders = 'content-length: ' +
        Buffer.byteLength(responseText) + '\r\n' +
        responseHeaders;
    }

    const responseData = 'HTTP/1.1 ' +
      request.socket.status + ' ' + request.socket.statusText + '\r\n' +
      responseHeaders +
      (responseHeaders.slice(-4) === '\r\n\r\n' ? '' : '\r\n') +
      responseText;

    this.pass(
      request.createResponse(),
      Buffer.from(responseData),
      callback
    );
  }

  handleProgress(request, data, callback, event = {}) {
    callback(defaults(event, {
      lengthComputable: true,
      loaded: 1,
      total: 10
    }));
  }

  setHeaders(request) {
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