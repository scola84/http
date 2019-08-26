import { ResourceRouter } from './resource'

export class MethodRouter extends ResourceRouter {
  act (request, data, callback) {
    if (this._downstreams[request.method]) {
      return this.pass(request.method, request, data, callback)
    }

    return this.handleMethodError(request, data, callback,
      Object.keys(this._downstreams))
  }
}
