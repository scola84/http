import { Worker } from '@scola/worker';

export class DataResolver extends Worker {
  act(request, data, callback) {
    const response = request.createResponse();

    if (typeof data.status === 'undefined') {
      data.status = request.method === 'POST' ? 201 : 200;
    }

    if (typeof response.status === 'undefined') {
      response.status = data.status;
    }

    this.pass(response, data, callback);
  }

  decide(request, data) {
    if (
      request.method !== 'GET' ||
      typeof data.data !== 'undefined'
    ) {
      return true;
    }

    return false;
  }
}
