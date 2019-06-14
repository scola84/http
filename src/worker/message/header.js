export default class Header {
  static parse(name, header) {
    if (typeof header === 'undefined') {
      return new Header({ name });
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

    const options = {
      name,
      value: parts[0],
      values: parts
    };

    return new Header(options);
  }

  constructor(options = {}) {
    this.name = options.name;
    this.value = options.value;
    this.values = options.values;
  }

  parseAcceptable(base = '') {
    const acceptable = this.values || [{ 0: base }];
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
