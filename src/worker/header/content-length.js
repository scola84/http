import { Worker } from '@scola/worker'
import { Buffer } from 'buffer/'

export class ContentLengthHeader extends Worker {
  act (message, data, callback) {
    this.setHeader(message, data)
    this.pass(message, data, callback)
  }

  decide (message) {
    if (typeof message.headers['content-length'] !== 'undefined') {
      return false
    }

    const encoding = message.headers['transfer-encoding'] || ''
    return encoding.indexOf('chunked') === -1
  }

  err (message, data, callback) {
    this.setHeader(message, data)
    this.fail(message, data, callback)
  }

  setHeader (message, data) {
    let length = 0

    if (typeof message.body.length !== 'undefined') {
      length = message.body.length
    }

    if (typeof data !== 'undefined' && data !== null) {
      length = Buffer.byteLength(data)
    }

    message.headers['content-length'] = length
  }
}
