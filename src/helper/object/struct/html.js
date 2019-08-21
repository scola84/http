import parser from 'parse5';

export class HtmlStruct {
  constructor(data) {
    this._data = data;
  }

  decode() {
    if (typeof this._data === 'string') {
      this._data = parser.parse(this._data);
    }

    return this._data;
  }

  encode() {
    if (typeof this._data !== 'string') {
      this._data = parser.serialize(this._data);
    }

    return this._data;
  }

  toString() {
    return this.encode();
  }
}
