import { Worker } from '@scola/worker';

export default class ObjectResolver extends Worker {
  constructor(methods) {
    super(methods);
    this._status = 200;
  }

  setStatus(value) {
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

    this.pass(response, data, callback);
  }

  filter(request, data) {
    if (this._filter) {
      return this._filter(request, data);
    }

    return data.object;
  }
}
