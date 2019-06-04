import { Router } from '@scola/worker';

export default class PathRouter extends Router {
  constructor(options) {
    super(options);
    this._paths = null;
  }

  act(request, data, callback) {
    if (this._paths === null) {
      this._paths = this.createPaths();
    }

    const url = request.parseUrl();

    let path = null;
    let params = null;

    for (let i = 0; i < this._paths.length; i += 1) {
      path = this._paths[i];
      params = path.regexp.exec(url.path);

      if (params !== null) {
        request.params = params;
        this.pass(path.name, request, data, callback);
        return;
      }
    }

    this.fail(
      request.createResponse(),
      new Error(`404 Path not found (${url.path})`),
      callback
    );
  }

  createPaths() {
    const paths = [];
    const names = Object.keys(this._workers);

    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];

      paths[paths.length] = {
        name,
        regexp: new RegExp(name)
      };
    }

    return paths;
  }
}
