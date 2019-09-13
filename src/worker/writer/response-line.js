import { Worker } from '@scola/worker'
import { Buffer } from 'buffer/'
import { STATUS_CODES } from 'http'

export class ResponseLineWriter extends Worker {
  act (message, data, callback) {
    data = this.writeData(message, data)
    this.pass(message, data, callback)
  }

  decide (message) {
    return message.state.line !== true
  }

  err (message, error, callback) {
    error.data = this.writeData(message, error.data)
    this.fail(message, error, callback)
  }

  writeData (message, data) {
    const line = 'HTTP/1.1 ' +
      (message.status || 200) + ' ' +
      STATUS_CODES[message.status || 200] +
      '\r\n'

    if (Buffer.isBuffer(data)) {
      data = Buffer.concat([Buffer.from(line), data])
    } else {
      data = line + data
    }

    message.state.line = true

    return data
  }
}
