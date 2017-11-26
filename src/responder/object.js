import { Worker } from '@scola/worker';

export default class ObjectResponder extends Worker {
  constructor(methods) {
    super(methods);

    this._filter = (request, data) => data.object;
    this._status = 200;
  }

  setFilter(value) {
    this._filter = value;
    return this;
  }

  setStatus(value) {
    this._status = value;
    return this;
  }

  act(request, data, callback) {
    data = this._filter(request, data);

    if (typeof data === 'undefined') {
      throw new Error('404 Object not found');
    }

    const response = request.createResponse();
    response.status = this._status;

    this.pass(response, data, callback);
  }
}
