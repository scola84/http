import { Manager } from '@scola/worker';

export default class TransferEncodingEncoder extends Manager {
  decide(message, data) {
    if (typeof message.body.transfer !== 'undefined') {
      return true;
    }

    if (typeof data === 'undefined') {
      return false;
    }

    if (typeof message.headers['Transfer-Encoding'] === 'undefined') {
      return false;
    }

    const transfer = message.headers['Transfer-Encoding'];

    for (let i = 0; i < transfer.length; i += 1) {
      if (typeof this._workers[transfer[i]] === 'undefined') {
        throw new Error(`501 Encoder not implemented (${transfer[i]})`);
      }
    }

    message.body.transfer = transfer
      .slice(0)
      .reverse();

    return true;
  }

  names(message) {
    return message.body.transfer.slice(0);
  }
}
