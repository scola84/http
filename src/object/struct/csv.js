import { Buffer } from 'buffer/';

const delimiters = [',', ';', '\t'];

const lineEndings = {
  CR: { char: '\r', code: 13 },
  CRLF: { char: '\r\n', code: 13 },
  LF: { char: '\n', code: 10 }
};

export class CsvStruct {
  static checkQuote(data, isValue, isEscaped, i) {
    if (isValue === true) {
      if (data[i + 1] === 34) {
        isEscaped = !isEscaped;
        i += 1;
      } else if (isEscaped === false) {
        isValue = false;
      }
    } else {
      isValue = true;
    }

    return [true, isValue, isEscaped, i];
  }

  static detectDelimiter(data, lineEndingCode) {
    data = String(data.slice(0, data.indexOf(lineEndingCode)));

    let count = 0;
    let delimiter = ',';
    let match = null;

    for (let i = 0; i < delimiters.length; i += 1) {
      match = data.match(new RegExp(delimiters[i]), 'g');
      delimiter = match && match.length > count ? delimiters[i] : delimiter;
      count = match && match.length > count ? match.length : count;
    }

    return delimiter;
  }

  static detectLineEnding(data) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i] === 13) {
        if (data[i + 1] === 10) {
          return 'CRLF';
        }

        return 'CR';
      } else if (data[i] === 10) {
        return 'LF';
      }
    }

    return 'LF';
  }

  static formatValue(value, delimiter, regexp, quote) {
    value = String(value);
    return quote || value.match(regexp) ?
      `"${value.replace(/"/g, '""')}"` : value;
  }

  static parseValue(data, begin, i, isQuoted) {
    const quote = (isQuoted ? 1 : 0);
    const value = data.slice(begin + quote, i - quote);
    return String(value).replace(/""/g, '"');
  }

  constructor(options, data) {
    this._options = options;
    this._data = data;
  }

  decode() {
    if (typeof this._data !== 'string') {
      return this._data;
    }

    let {
      delimiter = ',',
        lineEnding = 'LF'
    } = this._options;

    const data = Buffer.from(this._data.trim());

    if (lineEnding === 'detect') {
      lineEnding = CsvStruct.detectLineEnding(data);
    }

    lineEnding = lineEndings[lineEnding];

    if (delimiter === 'detect') {
      delimiter = CsvStruct.detectDelimiter(data, lineEnding.code);
    }

    delimiter = Buffer.from(delimiter)[0];

    let begin = 0;
    let i = 0;
    let line = [];

    let isEscaped = false;
    let isQuoted = false;
    let isValue = false;

    const lines = [];

    for (; i < data.length; i += 1) {
      if (data[i] === 34) {
        ([isQuoted, isValue, isEscaped, i] =
          CsvStruct.checkQuote(data, isValue, isEscaped, i));
      } else if (data[i] === delimiter && isValue === false) {
        line[line.length] = CsvStruct.parseValue(data, begin, i, isQuoted);
        isQuoted = false;
        begin = i + 1;
      } else if (data[i] === lineEnding.code && isValue === false) {
        line[line.length] = CsvStruct.parseValue(data, begin, i, isQuoted);
        lines[lines.length] = line;
        line = [];
        isQuoted = false;
        begin = i + lineEnding.char.length;
      }
    }

    line[line.length] = CsvStruct.parseValue(data, begin, i, isQuoted);
    lines[lines.length] = line;

    this._data = lines;
    return this._data;
  }

  encode() {
    if (typeof this._data === 'string') {
      return this._data;
    }

    const {
      delimiter = ',',
        fields = [],
        quote = false
    } = this._options;

    let {
      lineEnding = 'LF'
    } = this._options;

    lineEnding = lineEndings[lineEnding];

    const regexp = new RegExp(`\r|\n|"|${delimiter}`);

    let csv = '';
    let field = null;

    for (let i = 0; i < fields.length; i += 1) {
      field = fields[i];

      csv += i > 0 ? delimiter : '';

      csv += CsvStruct.formatValue(
        field.label,
        delimiter,
        regexp,
        quote
      );
    }

    for (let i = 0; i < this._data.length; i += 1) {
      csv += csv.length > 0 ? lineEnding.char : '';

      for (let j = 0; j < fields.length; j += 1) {
        field = fields[j];

        csv += j > 0 ?
          delimiter : '';

        csv += CsvStruct.formatValue(
          field.value(this._data[i], j),
          delimiter,
          regexp,
          quote
        );
      }
    }

    this._data = csv;
    return this._data;
  }

  toString() {
    return this.encode();
  }
}
