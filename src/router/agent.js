import { Router } from '@scola/worker';

export default class AgentRouter extends Router {
  constructor(options) {
    super(options);
    this._names = null;
  }

  act(request, data, callback) {
    if (this._names === null) {
      this._names = Object.keys(this._workers);
    }

    const agent = request.getHeader('User-Agent');

    let name = null;
    let params = null;

    for (let i = 0; i < this._names.length; i += 1) {
      name = this._names[i];
      params = new RegExp(name).exec(agent);

      if (params !== null) {
        this.pass(name, request, data, callback);
        return;
      }
    }

    this.pass('default', request, data, callback);
  }
}
