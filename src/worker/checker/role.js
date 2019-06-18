import { Worker } from '@scola/worker';

export class RoleChecker extends Worker {
  act(request, data, callback) {
    if (this.filter(request, data) === false) {
      throw new Error('403 Role not allowed');
    }

    this.pass(request, data, callback);
  }
}
