export default class Message {
  constructor(options = {}) {
    this.body = {};
    this.box = options.box;
    this.extra = options.extra;
    this.headers = options.headers || {};
    this.parser = { begin: 0, end: 0 };
    this.protocol = { name: null, version: null };
    this.socket = options.socket;
    this.state = options.state || {};
    this.user = null;
  }

  deleteHeader(name) {
    delete this.headers[name];
    delete this.headers[name.toLowerCase()];
    return this;
  }

  getHeader(name, value) {
    return this.headers[name] ||
      this.headers[name.toLowerCase()] ||
      value;
  }

  parseHeader(name, first) {
    const header = this.getHeader(name);
    return this.parseHeaderValue(header, first);
  }

  parseHeaderValue(header, first = false) {
    if (typeof header === 'undefined') {
      return header;
    }

    const parts = [];

    let char = null;
    let i = 0;
    let key = 0;
    let part = {};
    let value = '';

    for (; i <= header.length; i += 1) {
      char = header[i];

      if (char === ',' || i === header.length) {
        part[key] = value;
        parts.push(part);
        part = {};
        key = 0;
        value = '';
      } else if (char === ';') {
        part[key] = value;
        key = '';
        value = '';
      } else if (char === '=') {
        key = value;
        value = '';
      } else if (char === '"') {
        continue;
      } else if (char === ' ' && value === '') {
        continue;
      } else {
        value += char;
      }
    }

    return first === true ? parts[0] : parts;
  }

  setHeader(name, value) {
    const lowerName = name.toLowerCase();

    if (typeof this.headers[lowerName] !== 'undefined') {
      this.headers[lowerName] = value;
      return this;
    }

    this.headers[name] = value;
    return this;
  }
}
