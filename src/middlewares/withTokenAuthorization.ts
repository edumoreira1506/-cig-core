import { NextFunction, Response } from 'express';
import { ApiErrorType, AuthenticatedRequest, IAdvertisingFavorite, IBreeder, IMerchant } from '@cig-platform/types';
import jwt from 'jsonwebtoken';
import AuthBffClient from '@cig-platform/auth-bff-client';

import AuthError from '@Errors/AuthError';
import AccountServiceClient from '@Clients/AccountServiceClient';
import { UserRegisterTypeEnum } from '@cig-platform/enums';

type DecodedToken = {
  email: string;
  id: string;
  name: string;
  registerType: UserRegisterTypeEnum,
  breeders: IBreeder[];
  merchant: IMerchant;
  favorites: IAdvertisingFavorite[];
  iat: number;
  exp: number;
}

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

    const userDataToken  = jwt.decode(tokenData.token, { complete: true });

    if (!userDataToken?.payload) throw new AuthError();

    const tokenPayload = userDataToken.payload as Partial<DecodedToken>;

    const userData = await accountServiceClient.getUser(String(tokenPayload.id));

    if (userData?.id !== tokenPayload.id) throw new AuthError();

    req.user = userData;
    req.merchant = tokenPayload.merchant;
    req.breeders = tokenPayload.breeders;

    next();
  } catch (error: any) {
    return errorCallback(res, error?.getError ? error.getError() : error);
  }
};
