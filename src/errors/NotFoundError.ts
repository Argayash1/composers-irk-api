const { NOT_FOUND_404 } = require('../utils/constants');

interface INotFoundError extends Error {
  statusCode: number;
}

class NotFoundError extends Error implements INotFoundError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_404;
  }
}

export default NotFoundError;
