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
    const error = new Error(
      `${response.status} ${data.message || ''}`.trim()
    );

    error.status = data.status;
    error.message = data.message;
    error.details = data.details;

    return error;
  }

  _handleError(response, data, callback, error) {
    const {
      box,
      data: extraData,
      callback: extraCallback = () => {}
    } = response.request.extra;

    if (response.mustEnd()) {
      if (response.socket) {
        response.socket.removeAllListeners();
        response.socket.destroy();
      }
    }

    error = this._setError(box, error, data, extraData);

    try {
      extraCallback();
      this.fail(box, error, callback);
    } catch (tryError) {
      error = this._setError(box, tryError, data, extraData);
      this.fail(box, error, callback);
    }
  }

  _handleSuccess(response, data, callback) {
    const {
      box,
      data: extraData,
      callback: extraCallback = () => {}
    } = response.request.extra;

    if (response.mustEnd()) {
      if (response.socket) {
        response.socket.removeAllListeners();
        response.socket.destroy();
      }
    }

    try {
      data = this.merge(box, extraData, data, response);
    } catch (tryError) {
      this._handleError(response, data, callback, tryError);
      return;
    }

    try {
      extraCallback();
      this.pass(box, data, callback);
    } catch (tryError) {
      const error = this._setError(box, tryError, data, extraData);
      this.fail(box, error, callback);
    }
  }

  _setError(box, error, data, extraData) {
    box.error = true;

    error.data = extraData;
    error.responseData = data;

    return error;
  }
}
