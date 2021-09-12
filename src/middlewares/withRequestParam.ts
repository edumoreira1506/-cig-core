import { NextFunction, Request as ExpressRequest, Response } from 'express';

import ApiError from '@Errors/ApiError';
import NotFoundError from '@Errors/NotFoundError';
import BaseController from '@Controllers/BaseController';
import BaseRepository from '@Repositories/BaseRepository';

export default function withRequestParam<R extends BaseRepository<any>, E, T extends ExpressRequest>(
  paramName: string,
  requestParamName: string,
  controller: BaseController<E, R>,
  errorCallback: (res: Response, error: ApiError) => Response = BaseController.errorResponse,
  repository?: R,
) {
  type Request = ExpressRequest & {
    [requestParamName: string]: T;
  }

  return async (request: Request, response: Response, next: NextFunction): Promise<void | Response<string, Record<string, string>>> => {
    const id = request?.params?.[paramName] ?? '';

    return (repository ?? controller.repository).findById(id)
      .then(entity => {
        if (!entity) throw new NotFoundError();

        request[requestParamName] = entity;

        next();
      })
      .catch((error) => errorCallback(response, error?.getError?.() ?? error));
  };
}
