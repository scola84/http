import { Worker } from '@scola/worker';

export default class TrailerFieldsWriter extends Worker {
  act(message, data, callback) {
    const writeTrailers = (typeof message.body.te !== 'undefined' &&
      message.body.te.indexOf('trailers') !== -1);

    if (writeTrailers === true) {
      data = this._writeTrailers(message, data);
    }

    data += '\r\n';

    this.pass(message, data, callback);
  }

  decide(message) {
    if (
      message.state.body === true &&
      message.getHeader('Transfer-Encoding', '').indexOf('chunked') !== -1
    ) {
      return true;
    }

    return false;
  }

  _writeTrailers(message, data) {
    const keys = Object.keys(message.trailers);
    let key = '';

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      data += key + ': ' + message.trailers[key] + '\r\n';
    }

    return data;
  }
}
