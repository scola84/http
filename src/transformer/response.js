import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    try {
      if (response.status >= 400) {
        this._throwError(response, data);
      } else {
        this._handleSuccess(response, data, callback);
      }
    } catch (error) {
      this._handleError(response, data, callback, error);
    }
  }

  err(response, error, callback) {
    this._handleError(response, null, callback, error);
  }

  merge(box, extraData, data, response) {
    if (this._merge) {
      return this._merge(box, extraData, data, response);
    }

    return data;
  }

  _handleError(response, data, callback, error) {
    const {
      box,
      data: extraData,
      callback: extraCallback = () => {}
    } = response.request.extra;

    error.data = extraData;
    error.responseData = data;

    extraCallback();

    this.fail(box, error, callback);
  }

  _handleSuccess(response, data, callback) {
    const {
      box,
      data: extraData,
      callback: extraCallback = () => {}
    } = response.request.extra;

    data = this.merge(box, extraData, data, response);

    extraCallback();

    this.pass(box, data, callback);
  }

  _throwError(response, data) {
    let description = '';

    if (data && data.error && data.error.message) {
      description = data.error.message;
    }

    const message = `${response.status} ${description}`;
    const error = new Error(message.trim());

    if (data && data.error) {
      error.field = data.error.field;
      error.reason = data.error.reason;
    }

    throw error;
  }
}
