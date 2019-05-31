import { Worker } from '@scola/worker';

export default class UpgradeResponder extends Worker {
  decide(message) {
    return message.getHeader('Upgrade') === 'websocket';
  }

  act(message, data) {
    message.socket.removeAllListeners('data');
    message.socket.server.emit('upgrade', message, message.socket, data);
  }
}
