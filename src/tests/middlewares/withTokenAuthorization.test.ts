import { userFactory } from '@cig-platform/factories';

import { withTokenAuthorizationFactory } from '@Middlewares/withTokenAuthorization';

describe('withTokenAuthorization', () => {
  it('calls next when is a valid token', async () => {
    const token = 'token';
    const user = userFactory();
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(user)
    };
    const mockTokenService: any = {
      open: jest.fn().mockReturnValue(user)
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockTokenService, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(token) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(mockTokenService.open).toHaveBeenCalledWith(token);
    expect(mockRequest.user).toMatchObject(user);
  });

  it('calls errorCallback when token is not sent', async () => {
    const token = 'token';
    const user = userFactory();
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(user)
    };
    const mockTokenService: any = {
      open: jest.fn().mockReturnValue(user)
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockTokenService, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(null) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).not.toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockTokenService.open).not.toHaveBeenCalledWith(token);
  });

  it('calls errorCallback when is an valid token', async () => {
    const token = 'token';
    const user = userFactory();
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(user)
    };
    const mockTokenService: any = {
      open: jest.fn().mockReturnValue(null)
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockTokenService, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(token) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).not.toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockTokenService.open).toHaveBeenCalledWith(token);
  });

  it('calls errorCallback when user does not exist', async () => {
    const token = 'token';
    const user = userFactory();
    const mockErrorCallback = jest.fn();
    const mockAccountServiceClient: any = {
      getUser: jest.fn().mockResolvedValue(null)
    };
    const mockTokenService: any = {
      open: jest.fn().mockReturnValue(user)
    };
    const withTokenAuthorization = withTokenAuthorizationFactory(mockTokenService, mockErrorCallback, mockAccountServiceClient);
    const mockRequest: any = { header: jest.fn().mockReturnValue(token) };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withTokenAuthorization(mockRequest, mockResponse, mockNext);

    expect(mockAccountServiceClient.getUser).toHaveBeenCalledWith(user.id);
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockTokenService.open).toHaveBeenCalledWith(token);
  });
});
