import { Worker } from '@scola/worker'
import { Buffer } from 'buffer/'

export class OctetStreamDecoder extends Worker {
  getType () {
    return 'application/octet-stream'
  }

  act (message, data, callback) {
    if (message.state.body !== true) {
      this.concat(message, data)
      return
    }

    try {
      this.decode(message, data, callback)
    } catch (error) {
      throw new Error('400 ' + error.message)
    }
  }

  concat (message, data) {
    message.parser.octetstream = Buffer.concat([
      message.parser.octetstream || Buffer.from(''),
      data
    ])

    return message.parser.octetstream
  }

  decide (message, data) {
    return data === null ? null : true
  }

  decode (message, data, callback) {
    data = this.concat(message, data)
    message.parser.octetstream = null

    this.pass(message, data, callback)
  }
}
