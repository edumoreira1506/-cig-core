import { NextFunction, Response } from 'express';
import { ApiErrorType, AuthenticatedRequest } from '@cig-platform/types';

import AuthError from '@Errors/AuthError';
import TokenService from '@Services/TokenService';
import AccountServiceClient from '@Clients/AccountServiceClient';

export const withTokenAuthorizationFactory = (tokenService: TokenService, errorCallback: (res: Response, error: ApiErrorType) => Response, accountServiceClient: AccountServiceClient) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('X-Cig-Token');

    if (!token) throw new AuthError();

    const tokenData = await tokenService.open(token);

    if (!tokenData?.id) throw new AuthError();

    const userData = await accountServiceClient.getUser(String(tokenData?.id));

    if (userData?.id !== tokenData?.id) throw new AuthError();

    req.user = userData;
    req.merchant = tokenData.merchant;

    next();
  } catch (error: any) {
    return errorCallback(res, error?.getError ? error.getError() : error);
  }
};
