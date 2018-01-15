import { Worker } from '@scola/worker';
import { compare } from 'bcrypt';

export default class PasswordChecker extends Worker {
  act(request, data, callback) {
    compare(data.password, data.user.password, (error, result) => {
      if (error) {
        this.fail(request, error);
        return;
      }

      if (result === false) {
        this.fail(request, new Error('401 Password is invalid'), callback);
        return;
      }

      this.pass(request, data, callback);
    });
  }

  decide(request, data) {
    if (typeof data.user === 'undefined') {
      throw new Error('401 User not found');
    }

    return true;
  }
}
