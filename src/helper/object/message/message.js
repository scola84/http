import { Header } from './header';

export class Message {
  constructor(options = {}) {
    this.body = {};
    this.extra = options.extra || {};
    this.headers = options.headers || {};
    this.parser = { begin: 0, end: 0 };
    this.protocol = {};
    this.socket = options.socket;
    this.state = options.state || {};
    this.timeout = options.timeout;
    this.timestamp = null;
    this.user = null;
  }

  end() {
    this.socket.removeAllListeners();
    this.socket.destroy();
  }

  parseHeader(name) {
    return Header.parse(name, this.headers[name]);
  }
}
