import { ResourceRouter } from './resource';

export class PathRouter extends ResourceRouter {
  constructor(options) {
    super(options);
    this._paths = null;
  }

  act(request, data, callback) {
    if (this._paths === null) {
      this._paths = this.createPaths();
    }

    let path = null;
    let params = null;

    for (let i = 0; i < this._paths.length; i += 1) {
      path = this._paths[i];
      params = path.regexp.exec(request.url.path);

      if (params !== null) {
        request.params = params.groups || params;
        return this.pass(path.name, request, data, callback);
      }
    }

    return this.handlePathError(request, data, callback);
  }

  createPaths() {
    const paths = [];
    const names = Object.keys(this._downstreams);

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
