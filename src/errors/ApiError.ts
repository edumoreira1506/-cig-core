import { ApiErrorType } from '../@types/errors'

export default class ApiError extends Error {
  constructor(message: string) {
    super(message)
  }

  getError(): ApiErrorType {
    return {
      message: this.message,
      name: this.name,
    }
  }
}
