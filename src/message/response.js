import Message from './message';

export default class Response extends Message {
  constructor(options = {}) {
    super(options);

    this.request = options.request;
    this.status = options.status;

    const connection = this.request.getHeader('Connection');

    if (typeof connection !== 'undefined') {
      this.headers.Connection = connection;
    }
  }

  createResponse() {
    return this;
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
