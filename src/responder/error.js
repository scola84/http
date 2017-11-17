import { Worker } from '@scola/worker';

export default class ErrorResponder extends Worker {
  err(message, error, callback) {
    const response = message.createResponse();
    const match = error.message.match(/(\d{3})/);

    let data = '';

    response.status = match === null ? 500 : Number(match[1]);
    data = response.status === 500 ? '' : error.message
      .slice(match === 0 ? 0 : 4);

    response.state.body = true;

    this.fail(response, data, callback);
  }
}
