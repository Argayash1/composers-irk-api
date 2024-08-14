import { CONFLICT_409 } from '../utils/constants';

interface IConflictError extends Error {
  statusCode: number;
}

class ConflictError extends Error implements IConflictError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_409;
  }
}

export default ConflictError;
