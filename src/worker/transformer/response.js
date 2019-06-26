import { Worker } from '@scola/worker';

export class ResponseTransformer extends Worker {
  act(response, data, callback) {
    if (response.mustEnd()) {
      response.end();
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

  err(request, error, callback) {
    const response = request.createResponse();

    error = new Error(`500 ${error.message}`);
    error.status = 500;

    this.fail(response, error, callback);
  }
}
