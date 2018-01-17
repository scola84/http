import { Router } from '@scola/worker';

export default class PathRouter extends Router {
  act(request, data, callback) {
    const url = request.parseUrl();
    const paths = Object.keys(this._workers);
    let params = null;

    for (let i = 0; i < paths.length; i += 1) {
      params = new RegExp(paths[i]).exec(url.path);

      if (params !== null) {
        request.params = params;
        this.pass(paths[i], request, data, callback);
        return;
      }
    }

    this.fail(request.createResponse(),
      new Error('404 Path not found'), callback);
  }
}
