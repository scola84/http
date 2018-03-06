import { Worker } from '@scola/worker';
import { compare } from 'bcrypt';

export default class PasswordChecker extends Worker {
  act(request, data, callback) {
    compare(data.password, request.user.getPassword(), (error, result) => {
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

  decide(request) {
    if (typeof request.user === 'undefined') {
      throw new Error('401 User not found');
    }

    return true;
  }
}
