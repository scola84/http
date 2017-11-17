import { Router } from '@scola/worker';

export default class PathRouter extends Router {
  act(request, data, callback) {
    const url = request.parseUrl();
    let found = false;

    Object.keys(this._workers).forEach((path) => {
      const params = new RegExp(path).exec(url.path);

      if (params !== null) {
        found = true;
        request.params = params;
        this.pass(path, request, data, callback);
      }
    });

    if (found === false) {
      this.fail(request.createResponse(),
        new Error('404 Path not found'), callback);
    }
  }
}
