/*eslint no-useless-escape: 0 */

import { Worker } from '@scola/worker';
import { STATUS_CODES } from 'http';
const filter = [401, 403, 500];

export default class ErrorResponder extends Worker {
  err(message, error, callback) {
    const response = message.createResponse();
    const match = error.message.match(/(\d{3})?([^\(]*)/);

    response.status = match === null ? 500 : Number(match[1] || 500);
    response.state.body = true;

    response.setHeader('Content-Type', 'application/json');

    if (filter.indexOf(response.status) > -1) {
      match[2] = STATUS_CODES[response.status];
    }

    let data = {
      error: {
        message: match[2].trim()
      }
    };

    if (error.field) {
      data.error.field = error.field;
    }

    if (error.reason) {
      data.error.reason = error.reason;
    }

    data = JSON.stringify(data);

    this.fail(response, data, callback);
  }
}
