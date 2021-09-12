import ApiError from './ApiError';
import i18n from '../configs/i18n';

export default class AuthError extends ApiError {
  constructor() {
    super(i18n.__('auth.errors.invalid-login'));

    this.name = 'AuthError';
  }
}
