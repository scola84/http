import { Worker } from '@scola/worker';

export default class UserChecker extends Worker {
  act(request, data, callback) {
    if (request.user.getId() === null) {
      throw new Error('401 User not found');
    }

    this.pass(request, data, callback);
  }
}
