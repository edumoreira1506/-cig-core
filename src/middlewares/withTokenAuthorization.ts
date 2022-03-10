import { NextFunction, Response } from 'express';
import { ApiErrorType, AuthenticatedRequest } from '@cig-platform/types';
import jwt from 'jsonwebtoken';
import AuthBffClient from '@cig-platform/auth-bff-client';

import AuthError from '@Errors/AuthError';
import AccountServiceClient from '@Clients/AccountServiceClient';

export const withTokenAuthorizationFactory = (
  authBffClient: AuthBffClient,
  errorCallback: (res: Response, error: ApiErrorType) => Response,
  accountServiceClient: AccountServiceClient
) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('X-Cig-Token');

    if (!token) throw new AuthError();

    const tokenData = await authBffClient.refreshToken(token);

    if (!tokenData?.ok) throw new AuthError();

    const userDataToken = jwt.decode(tokenData.token, { complete: true });
    const userData = await accountServiceClient.getUser(String((userDataToken as any)?.payload?.id));

    if (userData?.id !== (userDataToken as any)?.payload?.id) throw new AuthError();

    req.user = userData;
    req.merchant = (userDataToken as any)?.payload?.merchant;

    next();
  } catch (error: any) {
    return errorCallback(res, error?.getError ? error.getError() : error);
  }
};
