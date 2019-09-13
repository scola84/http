import { Worker } from '@scola/worker'
import { Buffer } from 'buffer/'

export class HeaderFieldsWriter extends Worker {
  act (message, data, callback) {
    data = this.writeData(message, data)
    this.pass(message, data, callback)
  }

  decide (message) {
    return message.state.headers !== true
  }

  err (message, error, callback) {
    error.data = this.writeData(message, error.message)
    this.fail(message, error, callback)
  }

  isEmpty (data) {
    return typeof data === 'undefined' || data === null
  }

  writeData (message, data) {
    const keys = Object.keys(message.headers)

    let headers = ''
    let key = null
    let value = null

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i]
      value = message.headers[key]

      if (value) {
        headers += key + ': ' + value + '\r\n'
      }
    }

    if (Buffer.isBuffer(data)) {
      data = Buffer.concat([
        Buffer.from(headers + '\r\n'),
        Buffer.from(data)
      ])
    } else {
      data = headers + '\r\n' + (this.isEmpty(data) ? '' : data)
    }

    message.state.headers = true

    return data
  }
}
