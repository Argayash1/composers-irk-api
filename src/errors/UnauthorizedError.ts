const { UNAUTHORIZED_401 } = require('../utils/constants');

interface IUnauthorizedError extends Error {
  statusCode: number;
}

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_401;
  }
}

export default UnauthorizedError;
