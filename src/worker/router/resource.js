import { Router } from '@scola/worker';

export default class ResourceRouter extends Router {
  constructor(options) {
    super(options);
    this._resources = null;
  }

  act(request, data, callback) {
    if (this._resources === null) {
      this._resources = this.createResources();
    }

    const url = request.parseUrl();

    let path = null;
    let params = null;

    for (let i = 0; i < this._resources.length; i += 1) {
      path = this._resources[i];
      params = path.regexp.exec(`${request.method} ${url.path}`);

      if (params !== null) {
        request.params = params;
        this.pass(path.name, request, data, callback);
        return;
      }
    }

    this.fail(
      request.createResponse(),
      new Error('404 Resource not found' +
        ` (${request.method} ${url.path})`),
      callback
    );
  }

  createResources() {
    const resources = [];
    const names = Object.keys(this._workers);

    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];

      resources[resources.length] = {
        name,
        regexp: new RegExp(name)
      };
    }

    return resources;
  }
}
