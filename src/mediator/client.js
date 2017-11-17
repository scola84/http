import { Streamer } from '@scola/worker';

export default class ClientMediator extends Streamer {
  act(request) {
    this.read(request.createResponse());
  }

  stream(response) {
    return response.socket;
  }
}
