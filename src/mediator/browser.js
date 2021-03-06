import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';

export default class BrowserMediator extends Worker {
  act(message, data, callback = () => {}) {
    const error = () => {
      message.socket.onerror = null;
      message.socket.onload = null;
      message.socket.onprogress = null;
      message.socket.upload.onprogress = null;

      const errorText = (message.socket.status ?
          message.socket.status + ' ' : '') +
        'Could not complete message';

      this.fail(message, new Error(errorText));
    };

    const load = () => {
      callback({
        lengthComputable: true,
        loaded: 1,
        total: 1
      });

      message.socket.onerror = null;
      message.socket.onload = null;
      message.socket.onprogress = null;
      message.socket.upload.onprogress = null;

      const responseHeaders = message.socket.getAllResponseHeaders();

      const responseData = 'HTTP/1.1 ' +
        message.socket.status + ' ' + message.socket.statusText + '\r\n' +
        responseHeaders +
        (responseHeaders.slice(-4) === '\r\n\r\n' ? '' : '\r\n') +
        message.socket.responseText;

      this.pass(message.createResponse(), Buffer.from(responseData), callback);
    };

    const progress = (event) => {
      callback({
        lengthComputable: event.lengthComputable,
        loaded: message.method === 'GET' ? event.loaded : 1,
        total: message.method === 'GET' ? event.total : 10
      });
    };

    message.socket.onerror = error;
    message.socket.onload = load;
    message.socket.onprogress = progress;
    message.socket.upload.onprogress = progress;

    const names = Object.keys(message.headers || {});

    for (let i = 0; i < names.length; i += 1) {
      if (message.headers[names[i]] === 'multipart/form-data') {
        continue;
      }

      message.socket.setRequestHeader(names[i], message.headers[names[i]]);
    }

    message.socket.send(data);

    callback({
      lengthComputable: true,
      loaded: 1,
      total: 10
    });
  }
}
