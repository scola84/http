import { Router } from '@scola/worker';

export default class AgentRouter extends Router {
  constructor(options) {
    super(options);
    this._agents = null;
  }

  act(request, data, callback) {
    if (this._agents === null) {
      this._agents = Object.keys(this._workers).map((name) => {
        return {
          name,
          regexp: new RegExp(name)
        };
      });
    }

    const userAgent = request.getHeader('User-Agent');

    let agent = null;
    let params = null;

    for (let i = 0; i < this._agents.length; i += 1) {
      agent = this._agents[i];
      params = agent.regexp.exec(userAgent);

      if (params !== null) {
        this.pass(agent.name, request, data, callback);
        return;
      }
    }

    this.pass('default', request, data, callback);
  }
}
