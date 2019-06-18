import { Worker } from '@scola/worker';

export class UpgradeResponder extends Worker {
  decide(message) {
    return message.headers.upgrade === 'websocket';
  }

  act(message, data) {
    message.socket.removeAllListeners('data');
    message.socket.server.emit('upgrade', message, message.socket, data);
  }
}
