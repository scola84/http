import { Worker } from '@scola/worker'

export class UpgradeResponder extends Worker {
  act (message, data) {
    message.socket.removeAllListeners('data')
    message.socket.server.emit('upgrade', message, message.socket, data)
  }

  decide (message) {
    return message.headers.upgrade === 'websocket'
  }
}
