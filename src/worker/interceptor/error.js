import { Worker } from '@scola/worker';

export default class ErrorInterceptor extends Worker {
  err(response, data, callback) {
    if (response.status < 400) {
      response.state.body = true;
      response.status = 500;
    }

    this.fail(response, '', callback);
  }
}
