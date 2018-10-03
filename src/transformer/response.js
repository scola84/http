import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const box = this._resolve(response);

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

      box.error = true;
      this.fail(box, error, callback);

      return;
    }

    const merged = this.merge(box, data, response);

    if (typeof merged !== 'undefined') {
      data = merged;
    }

    this.pass(box, data, callback);
  }

  decide(response, data) {
    if (data === null) {
      if (typeof response.getHeader('Content-Type') === 'undefined') {
        return null;
      }

      if (response.getHeader('Content-Length') === 0) {
        return null;
      }
    }

    return true;
  }

  err(response, error, callback) {
    const box = this._resolve(response);

    if (box.error === true) {
      return;
    }

    box.error = true;
    this.fail(box, error, callback);
  }

  _resolve(response) {
    let box = response;

    if (box.request && box.request.box) {
      box = box.request.box;

      if (typeof box.response !== 'undefined') {
        throw new Error('Box has already been used');
      }

      box.response = response;
    }

    return box;
  }
}
