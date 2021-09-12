import ApiError from '../errors/ApiError';

export default class ValidationError extends ApiError {
  constructor(message: string) {
    super(message);

    this.name = 'ValidationError';
  }
}
