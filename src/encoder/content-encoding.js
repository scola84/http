import { Manager } from '@scola/worker';

export default class ContentEncodingEncoder extends Manager {
  decide(message, data) {
    if (typeof message.body.content !== 'undefined') {
      return true;
    }

    if (typeof data === 'undefined') {
      return false;
    }

    if (typeof message.headers['Content-Encoding'] === 'undefined') {
      return false;
    }

    const content = message.headers['Content-Encoding'];

    for (let i = 0; i < content.length; i += 1) {
      if (typeof this._workers[content[i]] === 'undefined') {
        throw new Error(`501 Encoder not implemented (${content[i]})`);
      }
    }

    message.body.content = content
      .slice(0)
      .reverse();

    return true;
  }

  names(message) {
    return message.body.content.slice(0);
  }
}
