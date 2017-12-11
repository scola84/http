import { Worker } from '@scola/worker';

export default class ListResolver extends Worker {
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

    const response = request.createResponse();
    response.status = this._status;

    this.pass(response, data, callback);
  }
}
