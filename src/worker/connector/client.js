import { Worker } from '@scola/worker'
import net from 'net'
import tls from 'tls'
import { Request } from '../../helper'

export class ClientConnector extends Worker {
  act (options, data, callback) {
    const request = new Request(options)

    if (typeof request.socket !== 'undefined') {
      this.pass(request, data, callback)
      return
    }

    try {
      this.open(request, data, callback, options)
    } catch (error) {
      error.data = data
      this.fail(request, error, callback)
    }
  }

  err (box, error, callback) {
    this.fail(new Request(), error, callback)
  }

  open (request, data, callback, options) {
    const library = request.url.scheme === 'http'
      ? net : tls

    const event = library === net
      ? 'connect' : 'secureConnect'

    request.headers.host = request.url.formatHost()

    const socket = library.connect(Object.assign({
      host: request.url.hostname,
      port: request.url.port,
      servername: request.url.hostname,
      timeout: request.timeout
    }, request.options))

    socket.once('error', (error) => {
      this.fail(request, error, callback)
    })

    socket.once('timeout', () => {
      request.socket = socket
      this.timeout(request, data, callback, options)
    })

    socket.once(event, () => {
      request.socket = socket
      this.pass(request, data, callback)
    })
  }

  retry (request, data, callback, options) {
    if (request.socket) {
      request.socket.removeAllListeners()
      request.socket.destroy()
      delete request.socket
    }

    if (request.retry === 0) {
      const error = new Error('Connection timed out')
      this.fail(request, error, callback)
      return
    }

    options.retry -= 1
    this.act(options, data, callback)
  }

  timeout (request, data, callback, options) {
    try {
      this.retry(request, data, callback, options)
    } catch (error) {
      this.fail(request, error, callback)
    }
  }
}
