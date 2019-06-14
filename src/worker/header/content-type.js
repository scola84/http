import { Worker } from '@scola/worker';

export default class ContentTypeHeader extends Worker {
  constructor(methods) {
    super(methods);
    this._types = [];
  }

  addType(type) {
    this._types.push(type);
    return this;
  }

  act(message, data, callback) {
    const acceptable = message
      .parseHeader('Accept')
      .parseAcceptable('*/*');

    let asub = null;
    let atype = null;

    let isub = null;
    let itype = null;

    let msub = null;
    let mtype = null;

    for (let i = 0; i < acceptable.length; i += 1) {
      if (acceptable[i].q === 0) {
        continue;
      }

      for (let j = 0; j < this._types.length; j += 1) {
        [atype, asub] = acceptable[i][0].split('/');
        [itype, isub] = this._types[j].split('/');

        mtype = atype === '*' || atype === itype;
        msub = asub === '*' || asub === isub;

        if (mtype === true && msub === true) {
          message.headers['content-type'] = this._types[j];
          break;
        }
      }
    }

    this.pass(message, data, callback);
  }

  decide(message, data) {
    if (
      typeof data !== 'undefined' &&
      typeof message.headers['content-type'] === 'undefined'
    ) {
      return true;
    }

    return false;
  }
}
