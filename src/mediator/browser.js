import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';

export default class BrowserMediator extends Worker {
  act(message, data) {
    message.socket.onerror = () => {
      message.socket.onerror = null;
      message.socket.onload = null;

      const errorText = (message.socket.status ?
          message.socket.status + ' ' : '') +
        'Could not complete message';

      this.fail(message, new Error(errorText));
    };

    message.socket.onload = () => {
      message.socket.onerror = null;
      message.socket.onload = null;

      const responseData = 'HTTP/1.1 ' +
        message.socket.status + ' ' + message.socket.statusText + '\r\n' +
        message.socket.getAllResponseHeaders() + '\r\n' +
        message.socket.responseText;

      this.pass(message.createResponse(), Buffer.from(responseData));
    };

    Object.keys(message.headers || {}).forEach((name) => {
      message.socket.setRequestHeader(name, message.headers[name]);
    });

    message.socket.send(data);
  }
}
