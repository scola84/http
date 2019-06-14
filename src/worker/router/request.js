import { Router } from '@scola/worker';

export default class RequestRouter extends Router {
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

        request.params = params;
        name = `${request.method} ${request.url.path}`;

        return this.pass(name, request, data, callback);
      }
    }

    return this.handlePathError(request, data, callback);
  }

  createResources() {
    const resources = {};
    const names = Object.keys(this._workers);

    let method = null;
    let path = null;

    for (let i = 0; i < names.length; i += 1) {
      [method, path] = names[i].split(' ');

      resources[path] = resources[path] || {
        regexp: new RegExp(path),
        methods: []
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
