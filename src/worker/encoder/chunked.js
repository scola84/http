import { Worker } from '@scola/worker'
import { Buffer } from 'buffer/'
const CRLF = Buffer.from('\r\n')

export class ChunkedEncoder extends Worker {
  constructor (options = {}) {
    super(options)

    this._chunkLength = null
    this.setChunkLength(options.chunkLength)
  }

  getChunkLength () {
    return this._chunkLength
  }

  setChunkLength (chunkLength = 64 * 1024) {
    this._chunkLength = chunkLength
    return this
  }

  getEncoding () {
    return 'chunked'
  }

  act (message, data, callback) {
    if (data === null) {
      this.flush(message, data, callback)
    } else {
      this.encode(message, data, callback)
    }
  }

  decide (message) {
    return message.state.body !== true
  }

  encode (message, data, callback) {
    let buffer = null
    let i = 0
    let newLength = 0
    let oldLength = 0

    for (i = 0; i < data.length; i += this._chunkLength) {
      buffer = Buffer.from(data.slice(i, i + this._chunkLength))
      oldLength = buffer.length.toString(16)
      newLength = oldLength.length + buffer.length + 4

      this.pass(message, Buffer.concat([
        Buffer.from(oldLength),
        CRLF,
        buffer,
        CRLF
      ], newLength), callback)
    }
  }

  flush (message, data, callback) {
    message.state.body = true

    this.pass(message, Buffer.concat([
      Buffer.from('0'),
      CRLF
    ], 3), callback)
  }
}
