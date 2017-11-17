import { Router } from '@scola/worker';

export default class MethodRouter extends Router {
  act(request, data, callback) {
    if (this._workers[request.method]) {
      this.pass(request.method, request, data, callback);
      return;
    }

    this.fail(request.createResponse({
      headers: {
        Allow: Object.keys(this._workers)
      }
    }), new Error('405 Method not allowed'), callback);
  }
}
