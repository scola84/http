import { Worker } from '@scola/worker';

export class ResponseTransformer extends Worker {
  act(response, data, callback) {
    if (response.mustEnd()) {
      if (response.socket) {
        response.socket.removeAllListeners();
        response.socket.destroy();
      }
    }

    if (response.status < 400) {
      this.pass(response, data, callback);
      return;
    }

    const error = new Error(
      `${response.status} ${data.message || ''}`.trim()
    );

    error.data = data.data;
    error.status = response.status;

    this.fail(response, error, callback);
  }
}
