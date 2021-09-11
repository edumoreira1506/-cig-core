import 'module-alias/register';

import BaseController from '@Controllers/BaseController';
import ApiError from '@Errors/ApiError';
import ValidationError from '@Errors/ValidationError';
import withBodyValidation from '@Middlewares/withBodyValidation';
import { FindEntityErrorHandler } from '@Decorators/repository';

export default {
  BaseController,
  ApiError,
  ValidationError,
  withBodyValidation,
  FindEntityErrorHandler
};
