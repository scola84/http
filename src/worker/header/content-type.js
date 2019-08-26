import { Worker } from '@scola/worker'
const methods = ['POST', 'PUT']

export class ContentTypeHeader extends Worker {
  constructor (options = {}) {
    super(options)

    this._types = null
    this.setTypes(options.types)
  }

  getTypes () {
    return this._types
  }

  setTypes (value = []) {
    this._types = value
    return this
  }

  addType (value) {
    this._types.push(value)
    return this
  }

  act (message, data, callback) {
    this.setHeader(message, data)
    this.pass(message, data, callback)
  }

  setHeader (message, data) {
    if (message.status) {
      this.setResponseHeader(message)
    } else {
      this.setRequestHeader(message, data)
    }
  }

  setRequestHeader (message, data) {
    if (methods.indexOf(message.method) === -1) {
      return
    }

    const keys = Object.keys(data)

    let key = null
    let type = this._types[0]
    let values = null

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i]

      values = data[key]
      values = Array.isArray(values) ? values : [values]

      if (typeof window.File !== 'undefined') {
        for (let j = 0; j < values.length; j += 1) {
          if (values[j] instanceof window.File) {
            type = 'multipart/form-data'
          }
        }
      }
    }

    if (this._types.indexOf(type) > -1) {
      message.headers['content-type'] = type
    }
  }

  setResponseHeader (message) {
    const acceptable = message
      .parseHeader('Accept')
      .parseAcceptable('*/*')

    let asub = null
    let atype = null

    let isub = null
    let itype = null

    let msub = null
    let mtype = null

    for (let i = 0; i < acceptable.length; i += 1) {
      if (acceptable[i].q === 0) {
        continue
      }

      for (let j = 0; j < this._types.length; j += 1) {
        [atype, asub] = acceptable[i][0].split('/');
        [itype, isub] = this._types[j].split('/')

        mtype = atype === '*' || atype === itype
        msub = asub === '*' || asub === isub

        if (mtype === true && msub === true) {
          message.headers['content-type'] = this._types[j]
          break
        }
      }
    }
  }

  decide (message, data) {
    if (
      typeof data !== 'undefined' &&
      typeof message.headers['content-type'] === 'undefined'
    ) {
      return true
    }

    return false
  }
}
