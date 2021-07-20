import ApiError from './ApiError'

export default class ValidationError extends ApiError {
  constructor(message: string) {
    super(message)

    this.name = 'ValidationError'
  }
}
