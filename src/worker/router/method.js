import RequestRouter from './request';

export default class MethodRouter extends RequestRouter {
  act(request, data, callback) {
    if (this._workers[request.method]) {
      return this.pass(request.method, request, data, callback);
    }

    return this.handleMethodError(request, data, callback,
      Object.keys(this._workers));
  }
}
