import { Worker } from '@scola/worker';

export default class ObjectResolver extends Worker {
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
      throw new Error('404 Object not found');
    }

    const response = request.createResponse();
    response.status = this._status;

    if (data === null) {
      response.setHeader('Content-Type', 'application/octet-stream');
      data = '';
    }

    this.pass(response, data, callback);
  }
}
