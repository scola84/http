import defaults from 'lodash-es/defaultsDeep';
import qs from 'qs';

export default class Url {
  static parse(url) {
    if (url instanceof Url) {
      return url;
    }

    if (typeof url === 'object') {
      return new Url(url);
    }

    if (typeof url === 'undefined') {
      return url;
    }

    const options = {};

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
        if (pathPos === null) {
          authPos = end;
        }
      } else if (char === '?') {
        queryPos = end;
        break;
      }
    }

    if (pathPos === null) {
      pathPos = url.length;
    }

    if (schemePos !== null) {
      options.scheme = url.slice(begin, schemePos);
      begin = schemePos + 3;
    }

    if (authPos !== null) {
      options.auth = url.slice(begin, authPos);
      begin = authPos + 1;
    }

    if (portPos !== null) {
      options.port = url.slice(portPos + 1, pathPos);
    }

    if (begin > 0) {
      options.hostname = url.slice(begin, portPos || pathPos);
      begin = pathPos;
    }

    if (queryPos !== null) {
      options.query = qs.parse(url.slice(queryPos + 1));
    } else {
      options.query = {};
    }

    options.path = url.slice(pathPos, queryPos || url.length);

    return new Url(options);
  }

  constructor(options) {
    defaults(options, {
      hostname: typeof window === 'undefined' ?
        null : window.location.hostname,
      port: options.scheme === 'http' ? 80 : 443,
      scheme: 'https'
    });

    this.auth = options.auth;
    this.hostname = options.hostname;
    this.path = options.path;
    this.port = options.port;
    this.query = options.query;
    this.scheme = options.scheme;
  }

  format() {
    let string = '';

    string += this.scheme + '://';
    string += this.auth ? this.auth + '@' : '';
    string += this.formatHost();
    string += this.formatRelative();

    return string;
  }

  formatHost() {
    return this.hostname + (this.port ? ':' + this.port : '');
  }

  formatRelative() {
    const query = qs.stringify(this.query);
    return this.path + (query ? '?' + query : '');
  }
}
