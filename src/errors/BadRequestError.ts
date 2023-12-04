import { BAD_REQUEST_400 } from '../utils/constants';

interface IBadRequestError extends Error {
  statusCode: number;
}

class BadRequestError extends Error implements IBadRequestError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_400;
  }
}

export default BadRequestError;
