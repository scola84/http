import { Manager } from '@scola/worker';

export default class ContentEncodingDecoder extends Manager {
  decide(message) {
    if (typeof message.body.content !== 'undefined') {
      return true;
    }

    const content = message.parseHeader('Content-Encoding');

    if (typeof content === 'undefined') {
      return false;
    }

    for (let i = 0; i < content.length; i += 1) {
      if (typeof this._workers[content[i][0]] === 'undefined') {
        throw new Error(`501 Decoder not implemented (${content[i][0]})`);
      }
    }

    message.body.content = content
      .reverse()
      .map((encoding) => encoding[0]);

    return true;
  }

  names(message) {
    return message.body.content.slice(0);
  }
}
