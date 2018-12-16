import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const [box, extraData] = this._resolveResponse(response);

    if (response.status >= 400) {
      this._handleError(response, data, callback, box, extraData);
      return;
    }

    this._handleSuccess(response, data, callback, box, extraData);
  }

  err(response, error, callback) {
    const [box, extraData] = this._resolveResponse(response);

    box.error = true;
    error.data = extraData;

    this.fail(box, error, callback);
  }

  _handleError(response, data, callback, box, extraData) {
    const description = data &&
      (data.error && data.error.message || data.message) ||
      '';

    const message = `${response.status} ${description}`;
    const error = new Error(message.trim());

    box.error = true;

    error.data = extraData;
    error.responseData = data;

    if (data && data.error) {
      error.field = data.error.field;
      error.reason = data.error.reason;
    }

    this.fail(box, error, callback);
  }

  _handleSuccess(response, data, callback, box, extraData) {
    try {
      data = this.merge(box, extraData, data, response);
      this.pass(box, data, callback);
    } catch (error) {
      error.data = extraData;
      error.responseData = data;
      this.fail(box, error, callback);
    }
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
