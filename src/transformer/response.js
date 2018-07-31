import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const box = response.request.box;
    box.response = response;

    if (response.status >= 400) {
      let error = null;

      if (data && data.error) {
        error = new Error(`${response.status} ${data.error.message}`);
        error.field = data.error.field;
        error.reason = data.error.reason;
      } else {
        error = new Error(String(response.status));
        error.data = data;
      }

      this.fail(box, error, callback);
      return;
    }

    const merged = this.merge(box, data, response);

    if (typeof merged !== 'undefined') {
      data = merged;
    }

    this.pass(box, data, callback);
  }

  err(response, error, callback) {
    let box = response;

    if (box.request) {
      box = box.request.box;
      box.response = response;
    }

    this.fail(box, error, callback);
  }
}
