import { Worker } from '@scola/worker';

export default class OptionsResolver extends Worker {
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

    response.status = this._status;
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (data === null) {
      this._resolveEmpty(response, data, callback);
      return;
    }

    response.setHeader('Allow', Object.keys(data));

    this.pass(response, data, callback);
  }

  _resolveEmpty(response, data, callback) {
    response.setHeader('Content-Type', 'application/octet-stream');
    this.pass(response, '', callback);
  }
}
