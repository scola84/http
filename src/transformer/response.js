import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    if (response.status >= 400) {
      this._handleError(response, data, callback,
        this._createError(response, data));
    } else {
      this._handleSuccess(response, data, callback);
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

  _createError(response, data) {
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

    return error;
  }

  _handleError(response, data, callback, error) {
    const {
      box,
      data: extraData,
      callback: extraCallback = () => {}
    } = response.request.extra;

    box.error = true;

    error.data = extraData;
    error.responseData = data;
    error.responseString = String(data);

    if (response.mustEnd()) {
      if (response.socket) {
        response.socket.removeAllListeners();
        response.socket.destroy();
      }
    }

    try {
      extraCallback();
      this.fail(box, error, callback);
    } catch (tryError) {
      tryError.data = extraData;
      this.fail(box, tryError, callback);
    }
  }

  _handleSuccess(response, data, callback) {
    const {
      box,
      data: extraData,
      callback: extraCallback = () => {}
    } = response.request.extra;

    data = this.merge(box, extraData, data, response);

    if (response.mustEnd()) {
      if (response.socket) {
        response.socket.removeAllListeners();
        response.socket.destroy();
      }
    }

    try {
      extraCallback();
      this.pass(box, data, callback);
    } catch (tryError) {
      tryError.data = data;
      this.fail(box, tryError, callback);
    }
  }
}
