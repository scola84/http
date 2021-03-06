import { Worker } from '@scola/worker';

export default class ListResolver extends Worker {
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

    const response = request.createResponse();

    response.status = this._status;
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    this.pass(response, data, callback);
  }
}
