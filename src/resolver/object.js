import { Streamer } from '@scola/worker';
import decodeUriComponent from 'decode-uri-component';
import { createReadStream, stat } from 'fs';

export default class ObjectResolver extends Streamer {
  constructor(options = {}) {
    super(options);

    this._status = null;
    this._type = null;

    this.setStatus(options.status);
    this.setType(options.type);
  }

  setStatus(value = 200) {
    this._status = value;
    return this;
  }

  setType(value = 'data') {
    this._type = value;
    return this;
  }

  act(request, data, callback) {
    data = this.filter(request, data);

    if (typeof data === 'undefined') {
      throw new Error('404 Object not found' +
        ` (${request.method} ${request.parseUrl().path})`);
    }

    const response = request.createResponse();

    response.status = this._status;
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (data === null) {
      this._resolveEmpty(response, data, callback);
      return;
    }

    if (this._type === 'file') {
      this._resolveFile(response, data, callback);
      return;
    }

    this.pass(response, data, callback);
  }

  stream(response, data) {
    return createReadStream(data.file.path + '-' +
      response.request.params[3]);
  }

  _resolveEmpty(response, data, callback) {
    response.setHeader('Content-Type', 'application/octet-stream');
    this.pass(response, '', callback);
  }

  _resolveError(response, error, callback) {
    this.fail(response,
      new Error(`404 File not found (${error.message})`), callback);
  }

  _resolveFile(response, data, callback) {
    if (data.file.name !== decodeUriComponent(response.request.params[4])) {
      this._resolveError(response, new Error('Invalid file name'), callback);
      return;
    }

    const file = data.file.path + '-' + response.request.params[3];

    stat(file, (error, stats) => {
      if (error) {
        this._resolveError(response, error, callback);
        return;
      }

      response.setHeader('Content-Length', stats.size);
      response.setHeader('Content-Type', data.file.type);

      this.read(response, data);
    });
  }
}
