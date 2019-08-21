import defaults from 'lodash-es/defaultsDeep';
import qs from 'qs';

export class Url {
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
    defaults(this, options, {
      auth: null,
      hostname: null,
      path: null,
      port: options.scheme === 'http' ? 80 : 443,
      query: null,
      scheme: 'https'
    });
  }

  format() {
    let string = '';

    string += this.formatScheme();
    string += this.formatAuth();
    string += this.formatHost();
    string += this.formatPath();

    return string;
  }

  formatAuth() {
    return this.auth ? this.auth + '@' : '';
  }

  formatHost() {
    return this.hostname + (this.port ? ':' + this.port : '');
  }

  formatPath() {
    return this.path + qs.stringify(this.query, {
      addQueryPrefix: true,
      filter: (name, value) => {
        return value === '' ? void 0 : value;
      }
    });
  }

  formatScheme() {
    return this.scheme + '://';
  }
}
