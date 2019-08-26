import { Worker } from '@scola/worker'

export class ResponseLineParser extends Worker {
  constructor (options = {}) {
    super(options)

    this._maxLength = null
    this.setMaxLength(options.maxLength)
  }

  getMaxLength () {
    return this._maxLength
  }

  setMaxLength (maxLength = 8 * 1024) {
    this._maxLength = maxLength
    return this
  }

  act (message, data, callback) {
    if (
      data === null ||
      data.length === 0
    ) {
      throw new Error('Empty reply from server')
    }

    for (; message.parser.end < data.length; message.parser.end += 1) {
      if (message.state.line === true) {
        break
      }

      this.processCode(message, data)
    }

    if (message.state.line === true) {
      this.pass(message, data, callback)
    } else {
      message.parser.data = data.slice(message.parser.begin)
    }
  }

  decide (message) {
    return message.state.line !== true
  }

  processCode (message, data) {
    message.parser.length = (message.parser.length || 0) + 1

    if (message.parser.length > this._maxLength) {
      throw new Error('413 Header length exceeds maximum')
    }

    const code = data[message.parser.end]

    if (code === 32) {
      this.processSpace(message, data)
    } else if (code === 47) {
      this.processSlash(message, data)
    } else if (code === 10) {
      this.processLineFeed(message, data)
    }
  }

  processLineFeed (message) {
    message.parser.begin = message.parser.end + 1
    message.state.line = true
  }

  processProtocolName (message, data) {
    message.protocol.name = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end
    )

    message.parser.begin = message.parser.end + 1
  }

  processProtocolVersion (message, data) {
    message.protocol.version = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end
    )

    message.parser.begin = message.parser.end + 1
  }

  processSlash (message, data) {
    if (typeof message.protocol.name === 'undefined') {
      this.processProtocolName(message, data)
    }
  }

  processSpace (message, data) {
    if (typeof message.protocol.version === 'undefined') {
      this.processProtocolVersion(message, data)
    } else if (typeof message.status === 'undefined') {
      this.processStatus(message, data)
    }
  }

  processStatus (message, data) {
    message.status = Number(data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end
    ))

    message.parser.begin = message.parser.end + 1
  }
}
