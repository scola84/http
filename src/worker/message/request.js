import defaults from 'lodash-es/defaultsDeep';
import { Message } from './message';
import { Response } from './response';
import { Url } from './url';

export class Request extends Message {
  constructor(options = {}) {
    options = defaults({}, options, {
      retry: 0,
      timeout: 60000
    });

    super(options);

    this.method = options.method;
    this.retry = options.retry;
    this.timeout = options.timeout;
    this.url = Url.parse(options.url);
  }

  createResponse() {
    return new Response({
      request: this,
      socket: this.socket
    });
  }

  mustEnd() {
    return false;
  }
}
