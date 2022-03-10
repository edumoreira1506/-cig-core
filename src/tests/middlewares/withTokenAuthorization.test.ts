import { userFactory } from '@cig-platform/factories';
import jwt from 'jsonwebtoken';

import { withTokenAuthorizationFactory } from '@Middlewares/withTokenAuthorization';

describe('withTokenAuthorization', () => {
  it('calls next when is a valid token', async () => {
    const user = userFactory();
    const token = jwt.sign({ user }, 'FAKE SECRET');
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(user)
    };
    const mockAuthBffClient: any = {
      refreshToken: jest.fn().mockResolvedValue({ ok: true, token })
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockAuthBffClient, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(token) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(mockAuthBffClient.refreshToken).toHaveBeenCalledWith(token);
    expect(mockRequest.user).toMatchObject(user);
  });

  it('calls errorCallback when token is not sent', async () => {
    const token = 'token';
    const user = userFactory();
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(user)
    };
    const mockAuthBffClient: any = {
      refreshToken: jest.fn().mockResolvedValue({ ok: true, token })
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockAuthBffClient, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(null) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).not.toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockAuthBffClient.refreshToken).not.toHaveBeenCalled();
  });

  it('calls errorCallback when is an invalid token', async () => {
    const token = 'token';
    const user = userFactory();
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(user)
    };
    const mockAuthBffClient: any = {
      refreshToken: jest.fn().mockResolvedValue(null)
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockAuthBffClient, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(token) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).not.toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockAuthBffClient.refreshToken).toHaveBeenCalledWith(token);
  });

  it('calls errorCallback when user does not exist', async () => {
    const user = userFactory();
    const token = jwt.sign({ user }, 'FAKE SECRET');
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(null)
    };
    const mockAuthBffClient: any = {
      refreshToken: jest.fn().mockResolvedValue({ ok: true, token })
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockAuthBffClient, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(token) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockAuthBffClient.refreshToken).toHaveBeenCalledWith(token);
  });
});
