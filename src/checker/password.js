import { Worker } from '@scola/worker';
import { compare } from 'bcrypt';

export default class PasswordChecker extends Worker {
  act(request, data, callback) {
    const hash = request.user.getDetail('password') || '';
    request.user.unsetDetail('password');

    compare(data.password, hash, (error, result) => {
      if (error) {
        this.fail(request, error, callback);
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
    if (request.user === null) {
      throw new Error('401 User not found');
    }

    return true;
  }
}
