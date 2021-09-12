import ApiError from '../errors/ApiError';
import i18n from '../configs/i18n';

export default class NotFoundError extends ApiError {
  constructor() {
    super(i18n.__('errors.not-found'));

    this.name = 'NotFoundError';
  }
}
