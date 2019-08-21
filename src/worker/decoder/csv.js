import { Worker } from '@scola/worker';
import { CsvStruct } from '../../helper';

export class CsvDecoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._delimiter = null;
    this._lineEnding = null;

    this.setDelimiter(options.delimiter);
    this.setLineEnding(options.lineEnding);
  }

  getDelimiter() {
    return this._delimiter;
  }

  setDelimiter(value = ',') {
    this._delimiter = value;
    return this;
  }

  getLineEnding() {
    return this._lineEnding;
  }

  setLineEnding(value = 'LF') {
    this._lineEnding = value;
    return this;
  }

  getType() {
    return 'text/csv';
  }

  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.csv = (message.parser.csv || '') + data;
      return;
    }

    try {
      this.decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  decide(message, data) {
    return data === null ? null : true;
  }

  decode(message, data, callback) {
    const struct = new CsvStruct({
      delimiter: this._delimiter,
      lineEnding: this._lineEnding
    }, (message.parser.csv || '') + data);

    data = struct.decode();

    message.parser.csv = null;

    this.pass(message, data, callback);
  }
}
