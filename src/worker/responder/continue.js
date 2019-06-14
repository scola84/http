import { Worker } from '@scola/worker';

export default class ContinueResponder extends Worker {
  decide(message) {
    return message.headers.expect === '100-continue';
  }

  act(message) {
    message.socket.write('HTTP/1.1 100 Continue\r\n\r\n');
    delete message.headers.expect;
  }
}
