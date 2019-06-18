import { Streamer } from '@scola/worker';

export class ClientMediator extends Streamer {
  act(request) {
    this.read(request.createResponse());
  }

  err(request, error, callback) {
    this.fail(request.createResponse(), error, callback);
  }

  stream(response) {
    return response.socket;
  }
}
