import { Router } from '@scola/worker';

export default class PathRouter extends Router {
  constructor(options) {
    super(options);
    this._names = null;
  }

  act(request, data, callback) {
    if (this._names === null) {
      this._names = Object.keys(this._workers);
    }

    const url = request.parseUrl();

    let name = null;
    let params = null;

    for (let i = 0; i < this._names.length; i += 1) {
      name = this._names[i];
      params = new RegExp(name).exec(url.path);

      if (params !== null) {
        request.params = params;
        this.pass(name, request, data, callback);
        return;
      }
    }

    this.fail(request.createResponse(),
      new Error(`404 Path not found (${url.path})`), callback);
  }
}
