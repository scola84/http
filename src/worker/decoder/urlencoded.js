import { Worker } from '@scola/worker';
import qs from 'qs';

export class UrlencodedDecoder extends Worker {
  getType() {
    return 'application/x-www-form-urlencoded';
  }

  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.urlencoded = (message.parser.urlencoded || '') + data;
      return;
    }

    try {
      this.decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  decide(message, data) {
    return data === null ? null : true;
  }

  decode(message, data, callback) {
    data = (message.parser.urlencoded || '') + data;
    message.parser.urlencoded = null;

    if (data) {
      data = qs.parse(data);
    } else {
      data = {};
    }

    this.pass(message, data, callback);
  }
}
