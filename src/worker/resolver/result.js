import { Worker } from '@scola/worker';

export default class ResultResolver extends Worker {
  act(request, data, callback) {
    if (typeof data.data === 'undefined') {
      throw new Error('404 Object not found' +
        ` (${request.method} ${request.url.path})`);
    }

    const response = request.createResponse();

    if (typeof data.status === 'undefined') {
      data.status = request.method === 'POST' ? 201 : 200;
    }

    if (typeof response.status === 'undefined') {
      response.status = data.status;
    }

    this.pass(response, data, callback);
  }
}
