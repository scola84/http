import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const box = response.request.box;
    box.response = response;

    if (response.status >= 300) {
      const error = new Error(
        String(response.status) + (data.error && data.error.message ?
          ' ' + data.error.message : '')
      );

      this.fail(box, error, callback);
      return;
    }

    const merged = this.merge(box, data, response);

    if (typeof merged !== 'undefined') {
      data = merged;
    }

    this.pass(box, data, callback);
  }
}
