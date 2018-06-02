/*eslint no-useless-escape: 0 */

import { Worker } from '@scola/worker';

export default class ErrorResponder extends Worker {
  err(message, error, callback) {
    const response = message.createResponse();
    const match = error.message.match(/(\d{3})?([^\(]*)/);

    response.status = match === null ? 500 : Number(match[1] || 500);
    response.state.body = true;

    response.setHeader('Content-Type', 'application/json');

    if (response.status === 500) {
      match[2] = 'Internal Server Error';
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
