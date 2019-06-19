import { Manager } from '@scola/worker';

export class ContentTypeDecoder extends Manager {
  constructor(options = {}) {
    super(options);

    this._strict = null;
    this.setStrict(options.strict);
  }

  getStrict() {
    return this._strict;
  }

  setStrict(value = true) {
    this._strict = value;
    return this;
  }

  decide(message) {
    if (typeof message.body.type !== 'undefined') {
      return true;
    }

    const type = message.parseHeader('content-type');

    if (typeof type.value === 'undefined') {
      return false;
    }

    if (typeof this._pool[type.value[0]] === 'undefined') {
      if (this._strict === true) {
        throw new Error('415 Decoder not implemented ' +
          ` (${type[0]})`);
      }

      return false;
    }

    message.body.type = type.value[0];
    return true;
  }

  names(message) {
    return [message.body.type];
  }
}
