import { Manager } from '@scola/worker';

export default class TransferEncodingDecoder extends Manager {
  decide(message) {
    if (typeof message.body.transfer !== 'undefined') {
      return true;
    }

    const transfer = message.parseHeader('Transfer-Encoding');

    if (typeof transfer === 'undefined') {
      return false;
    }

    for (let i = 0; i < transfer.length; i += 1) {
      if (typeof this._workers[transfer[i][0]] === 'undefined') {
        throw new Error(`501 Decoder not implemented (${transfer[i][0]})`);
      }
    }

    message.body.transfer = transfer
      .reverse()
      .map((encoding) => encoding[0]);

    return true;
  }

  names(message) {
    return message.body.transfer.slice(0);
  }
}
