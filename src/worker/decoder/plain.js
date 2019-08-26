import { Worker } from '@scola/worker'

export class PlainDecoder extends Worker {
  getType () {
    return 'text/plain'
  }

  act (message, data, callback) {
    if (message.state.body !== true) {
      message.parser.plain = (message.parser.plain || '') + data
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
    data = (message.parser.plain || '') + data
    message.parser.plain = null

    this.pass(message, data, callback)
  }
}
