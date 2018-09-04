import Message from './message';
let defaultHeaders = null;

export default class Response extends Message {
  static setHeaders(value) {
    defaultHeaders = Object.assign(defaultHeaders || {}, value);
  }

  constructor(options = {}) {
    if (defaultHeaders !== null) {
      options.headers = Object.assign({},
        defaultHeaders, options.headers);
    }

    super(options);

    this.request = options.request;
    this.status = options.status;

    const connection = this.request.getHeader('Connection');

    if (typeof connection !== 'undefined') {
      this.headers.Connection = connection;
    }

    const setCookie = this.request.getHeader('Set-Cookie');

    if (typeof setCookie !== 'undefined') {
      this.headers['Set-Cookie'] = setCookie;
    }
  }

  createResponse() {
    return this;
  }

  mustEnd() {
    return this.getHeader('Connection') === 'close';
  }

  parseAcceptable(header, base = '') {
    const acceptable = this.request.parseHeader(header) || [{ 0: base }];
    let entry = null;

    for (let i = 0; i < acceptable.length; i += 1) {
      entry = acceptable[i];

      entry.hq = typeof entry.q === 'undefined' ? 0 : 1;
      entry.q = entry.hq === 1 ? Number(entry.q) : 1;

      entry.s = 0;
      entry.s += (entry[0].match(/\*/g) || '').length;
      entry.s += Object.keys(entry).length - 4;
    }

    acceptable.sort((a, b) => {
      return b.q - a.q || b.hq - a.hq || b.s - a.s || 0;
    });

    return acceptable;
  }
}
