const { CONFLICT } = require('./StatusCodes');

class Conflicted extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = Conflicted;