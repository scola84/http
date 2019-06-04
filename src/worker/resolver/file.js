import { Streamer } from '@scola/worker';
import decodeUriComponent from 'decode-uri-component';
import { createReadStream, stat } from 'fs';

export default class FileResolver extends Streamer {
  constructor(options = {}) {
    super(options);

    this._status = null;
    this.setStatus(options.status);
  }

  setStatus(value = 200) {
    this._status = value;
    return this;
  }

  act(request, data, callback) {
    data = this.filter(request, data);

    if (typeof data === 'undefined') {
      throw new Error('404 Object not found' +
        ` (${request.method} ${request.parseUrl().path})`);
    }

    const response = request.createResponse();

    response.body.dataType = data.file.type;
    response.status = this._status;
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (data === null) {
      this.resolveEmpty(response, data, callback);
      return;
    }

    if (data.file.name !== decodeUriComponent(response.request.params[4])) {
      this.resolveError(response, new Error('Invalid file name'), callback);
      return;
    }

    const file = data.file.path + '-' + response.request.params[3];

    stat(file, (error, stats) => {
      if (error) {
        this.resolveError(response, error, callback);
        return;
      }

      response.setHeader('Content-Length', stats.size);
      response.setHeader('Content-Type', data.file.type);

      if (data.file.path.slice(-3) === '.gz') {
        response.setHeader('Content-Encoding', ['gzip']);
      }

      this.read(response, data);
    });
  }

  end(response) {
    response.state.body = true;
    this.pass(response, null);
  }

  stream(response, data) {
    return createReadStream(data.file.path + '-' +
      response.request.params[3]);
  }

  resolveEmpty(response, data, callback) {
    response.setHeader('Content-Type', 'application/octet-stream');
    this.pass(response, '', callback);
  }

  resolveError(response, error, callback) {
    this.fail(response,
      new Error(`404 File not found (${error.message})`), callback);
  }
}
