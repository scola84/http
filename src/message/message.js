export default class Message {
  static formatHeaders(headers, delimiter = ': ', lf = '\r\n') {
    const keys = Object.keys(headers);

    let string = '';
    let key = '';

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      string += key + delimiter + headers[key] + lf;
    }

    return string;
  }

  static parseHeader(header, first = false) {
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

  constructor(options = {}) {
    this.body = {};
    this.box = options.box;
    this.extra = options.extra;
    this.headers = options.headers || {};
    this.parser = { begin: 0, end: 0 };
    this.protocol = { name: null, version: null };
    this.socket = options.socket;
    this.state = options.state || {};
    this.timestamp = null;
    this.user = null;
  }

  deleteHeader(name) {
    delete this.headers[name];
    delete this.headers[name.toLowerCase()];
    return this;
  }

  getHeader(name, value) {
    if (typeof this.headers[name] !== 'undefined') {
      return this.headers[name];
    }

    if (typeof this.headers[name.toLowerCase()] !== 'undefined') {
      return this.headers[name.toLowerCase()];
    }

    return value;
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

  getTimestamp() {
    if (this.timestamp === null) {
      this.timestamp = Date.now();
    }

    return this.timestamp;
  }

  formatHeaders() {
    return Message.formatHeaders(this.headers);
  }

  parseHeader(name, first) {
    const header = this.getHeader(name);
    return Message.parseHeader(header, first);
  }
}
