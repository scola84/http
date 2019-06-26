import { Worker } from '@scola/worker';
import Busboy from 'busboy';
import fs from 'fs-extra';
import defaults from 'lodash-es/defaultsDeep';
import shortid from 'shortid';

export class FormdataDecoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._config = null;
    this.setConfig(options);
  }

  getConfig() {
    return this._config;
  }

  setConfig(value = {}) {
    this._config = defaults({}, value, {
      base: '/tmp',
      path: '/'
    });

    fs.ensureDirSync(this._config.base + this._config.path);
    return this;
  }

  getType() {
    return 'multipart/form-data';
  }

  act(message, data, callback) {
    try {
      this.decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  decode(message, data, callback) {
    if (typeof message.parser.formdata === 'undefined') {
      this.setupParser(message, data, callback);
    }

    if (message.state.body === true) {
      message.parser.formdata.end(data, null, callback);
    } else {
      message.parser.formdata.write(data, null, callback);
    }
  }

  handleError(message, error, callback) {
    message.parser.formdata.removeAllListeners();
    message.parser.formdata = null;

    error = new Error('400 ' + error.message);

    this.fail(message, error, callback);
  }

  handleFinish(message, data, callback) {
    message.parser.formdata.removeAllListeners();
    message.parser.formdata = null;

    this.pass(message, data, callback);
  }

  setValue(data, name, value) {
    if (typeof data[name] !== 'undefined') {
      if (Array.isArray(data[name]) === true) {
        value = data[name].concat(value);
      } else {
        value = [data[name], value];
      }
    }

    data[name] = value;
  }

  setupParser(message, data, callback) {
    const options = Object.assign({}, this._config, {
      headers: (message._original || message).headers
    });

    const formdata = new Busboy(options);
    const parsed = {};

    formdata.on('field', (name, value) => {
      this.setValue(parsed, name, value);
    });

    formdata.on('file', (fieldName, stream, name, encoding, type) => {
      const file = {};

      file.name = name;
      file.type = type;
      file.size = 0;

      file.tmppath =
        this._config.base +
        this._config.path +
        shortid.generate();

      const target = fs.createWriteStream(file.tmppath);

      stream.on('data', (chunk) => {
        file.size += chunk.length;
      });

      stream.once('limit', () => {
        const error = new Error('File size exceeds maximum');
        this.handleError(message, error, callback);
      });

      stream.once('end', () => {
        this.setValue(parsed, fieldName, file);
      });

      stream.once('error', (error) => {
        this.setValue(parsed, fieldName, error);
      });

      target.on('drain', () => {
        callback(message, true);
      });

      stream.pipe(target);
    });

    formdata.once('error', (error) => {
      this.handleError(message, error, callback);
    });

    formdata.once('finish', () => {
      this.handleFinish(message, parsed, callback);
    });

    message.parser.formdata = formdata;
  }
}
