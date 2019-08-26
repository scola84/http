import { Worker } from '@scola/worker'
import { Buffer } from 'buffer/'

export class JsonEncoder extends Worker {
  getType () {
    return 'application/json'
  }

  act (message, data, callback) {
    try {
      this.encode(message, data, callback)
    } catch (error) {
      throw new Error('500 ' + error.message)
    }
  }

  decide (message) {
    return message.state.body !== true &&
      message.body.dataType !== this.getType()
  }

  encode (message, data, callback) {
    data = JSON.stringify(data)

    message.body.length = Buffer.byteLength(data)
    message.state.body = true

    this.pass(message, data, callback)
  }
}
