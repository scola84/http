import { Worker } from '@scola/worker'

export class TrailerFieldsWriter extends Worker {
  act (message, data, callback) {
    const writeTrailers = (typeof message.body.te !== 'undefined' &&
      message.body.te.indexOf('trailers') !== -1)

    if (writeTrailers === true) {
      data = this.writeTrailers(message, data)
    }

    data += '\r\n'

    this.pass(message, data, callback)
  }

  decide (message) {
    const encoding = message.headers['transfer-encoding'] || ''

    if (message.state.body === true && encoding.indexOf('chunked') !== -1) {
      return true
    }

    return false
  }

  writeTrailers (message, data) {
    const keys = Object.keys(message.trailers)
    let key = ''

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i]
      data += key + ': ' + message.trailers[key] + '\r\n'
    }

    return data
  }
}
