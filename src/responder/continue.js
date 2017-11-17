import { Worker } from '@scola/worker';

export default class ContinueResponder extends Worker {
  decide(message) {
    return message.getHeader('Expect') === '100-continue';
  }

  act(message) {
    message.socket.write('HTTP/1.1 100 Continue\r\n\r\n');
    message.deleteHeader('Expect');
  }
}
