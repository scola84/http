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

  static formatAuth(url) {
    return url.auth ? url.auth + '@' : '';
  }

  static formatHost(url) {
    return url.hostname + (url.port ? ':' + url.port : '');
  }

  static formatRelativeUrl(url) {
    return url.path + (url.query ? '?' + qs.stringify(url.query) : '');
  }

  static formatScheme(url) {
    return (url.scheme || 'https') + '://';
  }

  static formatUrl(url) {
    return Request.formatScheme(url) +
      Request.formatAuth(url) +
      Request.formatHost(url) +
      Request.formatRelativeUrl(url);
  }

  static parseUrl(url) {
    const parsed = {};

    let authPos = null;
    let pathPos = null;
    let portPos = null;
    let queryPos = null;
    let schemePos = null;

    let begin = 0;
    let end = 0;

    let char = '';

    for (; end < url.length; end += 1) {
      char = url[end];

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
      parsed.scheme = url.slice(begin, schemePos);
      begin = schemePos + 3;
    }

    if (authPos !== null) {
      parsed.auth = url.slice(begin, authPos);
      begin = authPos + 1;
    }

    if (portPos !== null) {
      parsed.port = url.slice(portPos + 1, pathPos);
    }

    if (begin > 0) {
      parsed.hostname = url.slice(begin, portPos || pathPos);
      begin = pathPos;
    }

    if (queryPos !== null) {
      parsed.query = qs.parse(url.slice(queryPos + 1));
    } else {
      parsed.query = {};
    }

    parsed.path = url.slice(pathPos, queryPos || url.length);

    return parsed;
  }

  constructor(options = {}) {
    if (defaultHeaders !== null) {
      options.headers = Object.assign({},
        defaultHeaders, options.headers);
    }

    super(options);

    this._name = null;
    this._url = null;

    this.method = options.method;
    this.timestamp = Date.now();
    this.url = options.url;
  }

  createResponse(options = {}) {
    options.request = this;
    options.socket = this.socket;

    return new Response(options);
  }

  formatAuth() {
    return Request.formatAuth(this.url);
  }

  formatHost() {
    return Request.formatHost(this.url);
  }

  formatRelativeUrl() {
    return Request.formatRelativeUrl(this.url);
  }

  formatScheme() {
    return Request.formatScheme(this.url);
  }

  formatUrl() {
    if (this._url === null) {
      this._url = Request.formatUrl(this.url);
    }

    return this._url;
  }

  getName() {
    if (this._name === null) {
      this._name = this.method.toLowerCase() + '.' +
        this.parseUrl().path.split('/').slice(1).join('.');
    }

    return this._name;
  }

  mustEnd() {
    return false;
  }

  parseUrl() {
    if (this._url === null) {
      this._url = Request.parseUrl(this.url);
    }

    return this._url;
  }
}
