import defaults from 'lodash-es/defaultsDeep';
import Message from './message';
import Response from './response';
import Url from './url';

export default class Request extends Message {
  constructor(options = {}) {
    super(options);

    defaults(options, {
      retry: 0,
      timeout: 60000
    });

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
