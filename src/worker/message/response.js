import Message from './message';

export default class Response extends Message {
  constructor(options = {}) {
    super(options);

    this.request = options.request;
    this.status = options.status;

    const connection = this.request.headers.connection;

    if (typeof connection !== 'undefined') {
      this.headers.connection = connection;
    }

    const setCookie = this.request.headers['set-cookie'];

    if (typeof setCookie !== 'undefined') {
      this.headers['set-cookie'] = setCookie;
    }
  }

  createResponse() {
    return this;
  }

  mustEnd() {
    return this.headers.connection === 'close';
  }
}
