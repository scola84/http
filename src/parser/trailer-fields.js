import HeaderFieldsParser from '../parser/header-fields';

export default class TrailerFieldsParser extends HeaderFieldsParser {
  act(message, data, callback) {
    message.parser.begin = 0;
    message.parser.end = 0;
    message.parser.trailer = true;

    super.act(message, data, callback);
  }

  decide(message, data) {
    return data !== null &&
      message.state.body === true &&
      message.state.headers === false;
  }

  pass(message, data, callback) {
    if (message.state.headers === true) {
      if (message.parser.trailer === true) {
        data = data.slice(message.parser.end);
      }

      super.pass(message, data, callback);
    }
  }
}
