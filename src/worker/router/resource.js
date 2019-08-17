import { Router } from '@scola/worker';

export class ResourceRouter extends Router {
  constructor(options) {
    super(options);
    this._resources = null;
  }

  act(request, data, callback) {
    if (this._resources === null) {
      this._resources = this.createResources();
    }

    let name = null;
    let params = null;
    let resource = null;

    for (let i = 0; i < this._resources.length; i += 1) {
      resource = this._resources[i];
      params = resource.regexp.exec(`${request.url.path}`);

      if (params !== null) {
        if (resource.methods.indexOf(request.method) === -1) {
          return this.handleMethodError(request, data, callback,
            resource.methods);
        }

        name = `${request.method} ${resource.path}`;
        request.params = params.groups || params;

        return this.pass(name, request, data, callback);
      }
    }

    return this.handlePathError(request, data, callback);
  }

  createResources() {
    const resources = {};
    const names = Object.keys(this._downstreams);

    let method = null;
    let name = null;
    let path = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];
      [method, path] = name.split(' ');

      resources[path] = resources[path] || {
        methods: [],
        path,
        regexp: new RegExp(path)
      };

      resources[path].methods.push(method);
    }

    return Object.values(resources);
  }

  handlePathError(request, data, callback) {
    const response = request.createResponse();

    const error = new Error('404 Resource not found' +
      ` (${request.method} ${request.url.path})`);

    this.fail(response, error, callback);
  }

  handleMethodError(request, data, callback, methods) {
    const response = request.createResponse();
    response.headers.allow = methods;

    const error = new Error('405 Method not allowed' +
      ` (${request.method} ${request.url.path})`);

    this.fail(response, error, callback);
  }
}
