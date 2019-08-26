import { Worker } from '@scola/worker'

export class JsonDecoder extends Worker {
  getType () {
    return 'application/json'
  }

  act (message, data, callback) {
    if (message.state.body !== true) {
      message.parser.json = (message.parser.json || '') + data
      return
    }

    try {
      this.decode(message, data, callback)
    } catch (error) {
      throw new Error('400 ' + error.message)
    }
  }

  decide (message, data) {
    return data === null ? null : true
  }

  decode (message, data, callback) {
    data = (message.parser.json || '') + data
    message.parser.json = null

    if (data) {
      data = JSON.parse(data)
    } else {
      data = {}
    }

    this.pass(message, data, callback)
  }
}
