import { Worker } from '@scola/worker'

export class ContinueResponder extends Worker {
  act (message) {
    message.socket.write('HTTP/1.1 100 Continue\r\n\r\n')
    delete message.headers.expect
  }

  decide (message) {
    return message.headers.expect === '100-continue'
  }
}
