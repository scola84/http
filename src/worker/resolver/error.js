import { Worker } from '@scola/worker';
import { STATUS_CODES } from 'http';
const filter = [401, 403, 500];

export default class ErrorResolver extends Worker {
  act(request, data, callback) {
    const error = new Error('404 Object not found' +
      ` (${request.method} ${request.url.path})`);
    return this.err(request, error, callback);
  }

  decide(response) {
    return typeof response.status === 'undefined';
  }

  err(request, error, callback) {
    this.log('fail', request, error, callback);

    const response = request.createResponse();
    const match = error.message.match(/(\d{3})?([^(]*)/);

    response.status = match === null ? 500 : Number(match[1] || 500);

    if (filter.indexOf(response.status) > -1) {
      match[2] = STATUS_CODES[response.status];
    }

    const data = {
      data: response.status < 500 ? error.data : null,
      message: match[2].trim(),
      status: response.status
    };

    this.pass(response, data, callback);
  }
}
