import { Router } from '@scola/worker'

export class AgentRouter extends Router {
  constructor (options) {
    super(options)
    this._agents = null
  }

  act (request, data, callback) {
    if (this._agents === null) {
      this._agents = this.createAgents()
    }

    const userAgent = request.headers['user-agent']

    let agent = null
    let params = null

    for (let i = 0; i < this._agents.length; i += 1) {
      agent = this._agents[i]
      params = agent.regexp.exec(userAgent)

      if (params !== null) {
        this.pass(agent.name, request, data, callback)
        return
      }
    }

    this.pass('default', request, data, callback)
  }

  createAgents () {
    const agents = []
    const names = Object.keys(this._downstreams)

    let name = null

    for (let i = 0; i < names.length; i += 1) {
      name = names[i]

      agents[agents.length] = {
        name,
        regexp: new RegExp(name)
      }
    }

    return agents
  }
}
