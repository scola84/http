import { Streamer } from '@scola/worker';
import { createReadStream, stat } from 'fs';

export class FileResolver extends Streamer {
  act(request, data, callback) {
    const response = request.createResponse();

    if (typeof data.status === 'undefined') {
      data.status = 200;
    }

    if (typeof response.status === 'undefined') {
      response.status = data.status;
    }

    stat(data.file.path, (error, stats) => {
      if (error) {
        return this.handleError(request, error, callback);
      }

      response.headers['content-length'] = stats.size;
      response.headers['content-type'] = data.file.type;

      if (data.file.path.slice(-3) === '.gz') {
        response.headers['content-encoding'] = ['gzip'];
      }

      return this.read(response, data);
    });
  }

  decide(request, data) {
    if (
      request.method === 'GET' &&
      typeof data.file !== 'undefined'
    ) {
      return true;
    }

    return false;
  }

  end(response) {
    response.state.body = true;
    this.pass(response, null);
  }

  handleError(request, error, callback) {
    const newError = new Error('404 File not found' +
      ` (${error.message})`);
    this.fail(request, newError, callback);
  }

  stream(response, data) {
    return createReadStream(data.file.path);
  }
}
