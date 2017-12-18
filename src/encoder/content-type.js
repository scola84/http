import { Manager } from '@scola/worker';

export default class ContentTypeEncoder extends Manager {
  constructor(options = {}) {
    super(options);

    this._strict = null;
    this.setStrict(options.strict);
  }

  setStrict(value = true) {
    this._strict = value;
    return this;
  }

  decide(message, data) {
    if (typeof message.body.type !== 'undefined') {
      return true;
    }

    if (typeof data === 'undefined') {
      return false;
    }

    if (typeof message.headers['Content-Type'] === 'undefined') {
      return false;
    }

    const type = message.parseHeader('Content-Type', true);

    if (typeof this._workers[type[0]] === 'undefined') {
      if (this._strict === true) {
        throw new Error(`406 Encoder not implemented (${type[0]})`);
      }

      return false;
    }

    message.body.type = type[0];
    return true;
  }

  names(message) {
    return [message.body.type];
  }
}
