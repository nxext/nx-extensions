const DefaultJestRunner = require('jest-runner');

class SerialJestRunner extends DefaultJestRunner {
  constructor(...args) {
    super(...args);
    this.isSerial = true;
  }
}

module.exports = SerialJestRunner;
