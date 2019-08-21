import defaults from 'lodash-es/defaultsDeep';
import { Message } from './message';
import { Response } from './response';
import { Url } from './url';

export class Request extends Message {
  constructor(options = {}) {
    super(options);

    defaults(this, options, {
      method: 'GET',
      retry: 0,
      timeout: 60000,
      url: null
    });

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
