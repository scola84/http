/*eslint no-useless-escape: 0 */

import { Worker } from '@scola/worker';

export default class ErrorResponder extends Worker {
  err(message, error, callback) {
    const response = message.createResponse();
    const match = error.message.match(/(\d{3})?([^\(]*)/);

    let data = '';

    response.status = match === null ? 500 : Number(match[1] || 500);
    data = response.status === 500 ? '' : match[2].trim();

    response.state.body = true;

    this.fail(response, data, callback);
  }
}
