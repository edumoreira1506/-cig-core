import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { ApiErrorType } from '@cig-platform/types';

import BaseController from '@Controllers/BaseController';
import ValidationError from '@Errors/ValidationError';

export const withBodyValidationFactory = (errorCallback: (res: Response, error: ApiErrorType) => Response) =>
  (schema: ObjectSchema) =>
    (request: Request, response: Response, next: NextFunction): void => {
      const { error } = schema.validate(request.body);

      if (error) {
        const errorMessage = error.message.toString();

        errorCallback(response, new ValidationError(errorMessage).getError());

        return;
      }

      next();
    };

export default withBodyValidationFactory(BaseController.errorResponse);
