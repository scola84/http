import qs from 'qs';
import Message from './message';
import Response from './response';

const defaultHeaders = {};

export default class Request extends Message {
  static getHeaders() {
    return defaultHeaders;
  }

  static setHeaders(headers) {
    const names = Object.keys(headers);

    for (let i = 0; i < names.length; i += 1) {
      if (headers[names[i]] === null) {
        delete defaultHeaders[names[i]];
      } else {
        defaultHeaders[names[i]] = headers[names[i]];
      }
    }
  }

  constructor(options = {}) {
    if (defaultHeaders !== null) {
      options.headers = Object.assign({},
        defaultHeaders, options.headers);
    }

    super(options);

    this.method = options.method;
    this.url = options.url;

    this._url = null;
  }

  createResponse(options = {}) {
    options.request = this;
    options.socket = this.socket;

    return new Response(options);
  }

  formatAuth() {
    return this.url.auth ? this.url.auth + '@' : '';
  }

  formatHost(url = {}) {
    const hostname = this.url.hostname || url.hostname;
    const port = this.url.port || url.port;

    return hostname + (port ? ':' + port : '');
  }

  formatRelativeUrl() {
    return this.url.path +
      (this.url.query ? '?' + qs.stringify(this.url.query) : '');
  }

  formatScheme() {
    return (this.url.scheme || 'https') + '://';
  }

  formatUrl(url) {
    if (this._url === null) {
      this._url = this._formatUrl(url);
    }

    return this._url;
  }

  mustEnd() {
    return false;
  }

  parseUrl() {
    if (this._url === null) {
      this._url = this._parseUrl();
    }

    return this._url;
  }

  _formatUrl(url) {
    return this.formatScheme() +
      this.formatAuth() +
      this.formatHost(url) +
      this.formatRelativeUrl();
  }

  _parseUrl() {
    const url = {};

    let authPos = null;
    let pathPos = null;
    let portPos = null;
    let queryPos = null;
    let schemePos = null;

    let begin = 0;
    let end = 0;

    let char = '';

    for (; end < this.url.length; end += 1) {
      char = this.url[end];

      if (char === ':') {
        if (schemePos === null) {
          schemePos = end;
          end += 3;
        } else {
          portPos = end;
        }
      } else if (char === '/') {
        if (pathPos === null) {
          pathPos = end;
        }
      } else if (char === '@') {
        authPos = end;
      } else if (char === '?') {
        queryPos = end;
        break;
      }
    }

    if (schemePos !== null) {
      url.scheme = this.url.slice(begin, schemePos);
      begin = schemePos + 3;
    }

    if (authPos !== null) {
      url.auth = this.url.slice(begin, authPos);
      begin = authPos + 1;
    }

    if (portPos !== null) {
      url.port = this.url.slice(portPos + 1, pathPos);
    }

    if (begin > 0) {
      url.hostname = this.url.slice(begin, portPos || pathPos);
      begin = pathPos;
    }

    if (queryPos !== null) {
      url.query = qs.parse(this.url.slice(queryPos + 1));
    } else {
      url.query = {};
    }

    url.path = this.url.slice(pathPos, queryPos || this.url.length);

    return url;
  }
}
