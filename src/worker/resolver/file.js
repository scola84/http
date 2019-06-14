import { Streamer } from '@scola/worker';
import { createReadStream, stat } from 'fs';

export default class FileResolver extends Streamer {
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

  handleError(request, error, callback) {
    const newError = new Error(`404 File not found (${error.message})`);
    this.fail(request, newError, callback);
  }

  decide(request, data) {
    return typeof data.file !== 'undefined';
  }

  end(response) {
    response.state.body = true;
    this.pass(response, null);
  }

  stream(response, data) {
    return createReadStream(data.file.path);
  }
}
