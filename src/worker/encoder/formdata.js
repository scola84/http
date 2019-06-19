import { Worker } from '@scola/worker';

export class FormdataEncoder extends Worker {
  getType() {
    return 'multipart/form-data';
  }

  act(message, data, callback) {
    try {
      this.encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  decide(message) {
    return message.state.body !== true &&
      message.body.dataType !== this.getType();
  }

  encode(message, data, callback) {
    const keys = Object.keys(data);
    const form = new FormData();

    let name = null;
    let value = null;

    for (let i = 0; i < keys.length; i += 1) {
      name = keys[i];
      value = data[name];
      value = Array.isArray(value) ? value : [value];

      for (let j = 0; j < value.length; j += 1) {
        form.append(name, value[j]);
      }
    }

    message.state.body = true;

    this.pass(message, form, callback);
  }
}
