import { Streamer } from '@scola/worker'

export class ClientMediator extends Streamer {
  act (request) {
    this.read(request.createResponse())
  }

  err (request, error, callback) {
    this.fail(request.createResponse(), error, callback)
  }

  createReadStream (response, data, callback) {
    callback(null, response.socket)
  }
}
