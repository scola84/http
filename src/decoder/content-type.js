import { Manager } from '@scola/worker';

export default class ContentTypeDecoder extends Manager {
  constructor(methods) {
    super(methods);
    this._strict = true;
  }

  setStrict(value) {
    this._strict = value;
    return this;
  }

  decide(message) {
    if (typeof message.body.type !== 'undefined') {
      return true;
    }

    const type = message.parseHeader('Content-Type', true);

    if (typeof type === 'undefined') {
      return false;
    }

    if (typeof this._workers[type[0]] === 'undefined') {
      if (this._strict === true) {
        throw new Error(`415 Decoder not implemented (${type[0]})`);
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
