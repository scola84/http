import { Worker } from '@scola/worker'

export class HeaderFieldsParser extends Worker {
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
    for (; message.parser.end < data.length; message.parser.end += 1) {
      if (message.state.headers === true) {
        break
      }

      this.processCode(message, data)
    }

    if (message.state.headers === true) {
      this.pass(message, data, callback)
    } else {
      message.parser.data = data.slice(message.parser.begin)
    }
  }

  decide (message) {
    return message.state.headers !== true
  }

  processCode (message, data) {
    message.parser.length = (message.parser.length || 0) + 1

    if (message.parser.length > this._maxLength) {
      throw new Error('413 Header length exceeds maximum')
    }

    const code = data[message.parser.end]

    if (code === 32) {
      this.processSpace(message, data)
    } else if (code === 58) {
      this.processColon(message, data)
    } else if (code === 10) {
      this.processLineFeed(message, data)
    } else if (code !== 13) {
      message.parser.spaces = 0
    }
  }

  processColon (message, data) {
    if (message.parser.key) {
      return
    }

    message.parser.key = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end - message.parser.spaces
    )

    message.parser.begin = message.parser.end + 1
  }

  processLineFeed (message, data) {
    const next = data[message.parser.end + 1]

    if (next === 9 || next === 32) {
      return
    }

    if (!message.parser.key) {
      message.parser.begin = message.parser.end + 1
      message.parser.length = null
      message.parser.spaces = null
      message.state.headers = true
      return
    }

    const key = message.parser.key.toLowerCase()

    let value = data.toString(
      'utf-8',
      message.parser.begin,
      message.parser.end - message.parser.spaces - 1
    )

    if (typeof message.headers[key] !== 'undefined') {
      if (message.headers[key].indexOf(value) === -1) {
        value = message.headers[key] + ', ' + value
      }
    }

    message.headers[key] = value
    message.parser.key = null
    message.parser.begin = message.parser.end + 1
  }

  processSpace (message) {
    if (message.parser.begin === message.parser.end) {
      message.parser.begin = message.parser.end + 1
    } else {
      message.parser.spaces += 1
    }
  }
}
