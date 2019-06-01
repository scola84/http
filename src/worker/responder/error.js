import { Worker } from '@scola/worker';
import { STATUS_CODES } from 'http';
const filter = [401, 403, 500];

export default class ErrorResponder extends Worker {
  err(message, error, callback) {
    const response = message.createResponse();
    const match = error.message.match(/(\d{3})?([^(]*)/);

    response.error = error;
    response.status = match === null ? 500 : Number(match[1] || 500);
    response.state.body = true;

    response.setHeader('Content-Type', 'application/json');

    if (filter.indexOf(response.status) > -1) {
      match[2] = STATUS_CODES[response.status];
    }

    let data = {
      error: {
        code: response.status,
        message: match[2].trim()
      }
    };

    if (response.status < 500) {
      data.error.details = error.details;
    }

    data = JSON.stringify(data);

    this.fail(response, data, callback);
  }
}
