import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const responseData = data;
    const [box, extraData] = this._resolveResponse(response);

    if (response.status >= 400) {
      this._resolveError(response, responseData, callback, box);
      return;
    }

    data = this.merge(box, extraData, responseData, response);

    this.pass(box, data, callback);
  }

  err(response, error, callback) {
    const [box, extraData] = this._resolveResponse(response);

    box.error = true;
    error.data = extraData;

    this.fail(box, error, callback);
  }

  _resolveError(response, data, callback, box) {
    const description = data &&
      (data.error && data.error.message || data.message) ||
      '';

    const message = `${response.status} ${description}`;
    const error = new Error(message.trim());

    box.error = true;
    error.data = data;

    if (data && data.error) {
      error.field = data.error.field;
      error.reason = data.error.reason;
    }

    this.fail(box, error, callback);
  }

  _resolveResponse(response) {
    const extra = response.request.extra;

    if (extra.callback) {
      extra.callback();
      extra.callback = null;
    }

    return [extra.box, extra.data];
  }
}
