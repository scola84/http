import { Manager } from '@scola/worker'

export class TransferEncodingDecoder extends Manager {
  decide (message) {
    if (typeof message.body.transfer !== 'undefined') {
      return true
    }

    const transfer = message.parseHeader('transfer-encoding')

    if (typeof transfer.values === 'undefined') {
      return false
    }

    for (let i = 0; i < transfer.values.length; i += 1) {
      if (typeof this._pool[transfer.values[i][0]] === 'undefined') {
        throw new Error('501 Decoder not implemented' +
          ` (${transfer[i][0]})`)
      }
    }

    message.body.transfer = transfer.values
      .reverse()
      .map((encoding) => encoding[0])

    return true
  }

  names (message) {
    return message.body.transfer.slice(0)
  }
}
