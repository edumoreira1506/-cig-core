import { NextFunction, Response } from 'express';

import ApiError from '@Errors/ApiError';
import NotFoundError from '@Errors/NotFoundError';
import BaseController from '@Controllers/BaseController';
import BaseRepository from '@Repositories/BaseRepository';

export default function withRequestParam<R extends BaseRepository<any>, E>(
  paramName: string,
  requestParamName: string,
  controller: BaseController<E, R>,
  errorCallback: (res: Response, error: ApiError) => Response = BaseController.errorResponse,
) {
  return async (request: any, response: Response, next: NextFunction): Promise<void | Response<string, Record<string, string>>> => {
    const id = request?.params?.[paramName] ?? '';

    return controller.repository.findById(id)
      .then(entity => {
        if (!entity) throw new NotFoundError();

        request[requestParamName] = entity;

        next();
      })
      .catch((error) => errorCallback(response, error?.getError?.() ?? error));
  };
}
