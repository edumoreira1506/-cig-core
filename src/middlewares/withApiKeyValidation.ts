import { NextFunction, Request, Response } from 'express';
import ApiKeyClient from '@cig-platform/api-keys-client';
import { ApiErrorType } from '@cig-platform/types';

import ApiError from '@Errors/ApiError';

export const withApiKeyFactory = (
  serviceUrl: string,
  serviceName: string,
  userName: string,
  userPassword: string,
  errorCallback: (res: Response, error: ApiErrorType) => Response
) =>
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const client = new ApiKeyClient(serviceUrl, userName, userPassword);
      const services = await client.getServices();
      const service = services.find(s => s.name === serviceName);

      if (!service) throw new ApiError('');

      const keys = await client.getKeys(service.id);
      const key = request.header('Cig-Api-Key');

      if (keys.every(k => k.id !== key) || !key) throw new ApiError('');

      next();
    } catch (error) {
      errorCallback(response, error as any);
    }
  };
