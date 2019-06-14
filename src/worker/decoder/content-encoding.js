import { Manager } from '@scola/worker';

export default class ContentEncodingDecoder extends Manager {
  decide(message) {
    if (typeof message.body.content !== 'undefined') {
      return true;
    }

    const content = message.parseHeader('Content-Encoding');

    if (typeof content.values === 'undefined') {
      return false;
    }

    for (let i = 0; i < content.values.length; i += 1) {
      if (typeof this._pool[content.values[i][0]] === 'undefined') {
        throw new Error('501 Decoder not implemented' +
          ` (${content[i][0]})`);
      }
    }

    message.body.content = content.values
      .reverse()
      .map((encoding) => encoding[0]);

    return true;
  }

  names(message) {
    return message.body.content.slice(0);
  }
}
