import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';

export default class BrowserMediator extends Worker {
  act(message, data, callback = () => {}) {
    message.socket.onerror = () => {
      message.socket.onerror = null;
      message.socket.onload = null;
      message.socket.onprogress = null;
      message.socket.upload.onprogress = null;

      const errorText = (message.socket.status ?
          message.socket.status + ' ' : '') +
        'Could not complete message';

      this.fail(message, new Error(errorText));
    };

    message.socket.onload = () => {
      callback();

      message.socket.onerror = null;
      message.socket.onload = null;
      message.socket.onprogress = null;
      message.socket.upload.onprogress = null;

      const responseData = 'HTTP/1.1 ' +
        message.socket.status + ' ' + message.socket.statusText + '\r\n' +
        message.socket.getAllResponseHeaders() + '\r\n' +
        message.socket.responseText;

      this.pass(message.createResponse(), Buffer.from(responseData), callback);
    };

    message.socket.onprogress = callback;
    message.socket.upload.onprogress = callback;

    const names = Object.keys(message.headers || {});

    for (let i = 0; i < names.length; i += 1) {
      if (message.headers[names[i]] === 'multipart/form-data') {
        continue;
      }

      message.socket.setRequestHeader(names[i], message.headers[names[i]]);
    }

    message.socket.send(data);
  }
}
