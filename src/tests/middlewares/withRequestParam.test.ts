import NotFoundError from '../../errors/NotFoundError';
import withRequestParamFactory from '../../middlewares/withRequestParam';

describe('withRequestParam', () => {
  it('calls next when entity exists', async () => {
    const entity = {};
    const mockRequestParam = 'param';
    const mockParam = 'param';
    const mockErrorCallback = jest.fn();
    const mockRepository = {
      findById: jest.fn().mockResolvedValue(entity)
    };
    const mockController: any = {
      repository: mockRepository
    };
    const withUserParam = withRequestParamFactory(mockParam, mockRequestParam, mockController, mockErrorCallback);
    const mockRequest: any = {};
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withUserParam(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest[mockRequestParam]).toMatchObject(entity);
    expect(mockErrorCallback).not.toHaveBeenCalled();
  });

  it('calls errorCallback when has an error', async () => {
    const error = new Error('Example error');
    const mockRequestParam = 'param';
    const mockParam = 'param';
    const mockErrorCallback = jest.fn();
    const mockRepository = {
      findById: jest.fn().mockRejectedValue(error)
    };
    const mockController: any = {
      repository: mockRepository
    };
    const withUserParam = withRequestParamFactory(mockParam, mockRequestParam, mockController, mockErrorCallback);
    const mockRequest = {};
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withUserParam(mockRequest, mockResponse, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalledWith(mockResponse, error);
  });

  it('calls errorCallback when user does not exist', async () => {
    const entity = null;
    const mockRequestParam = 'param';
    const mockParam = 'param';
    const mockErrorCallback = jest.fn();
    const mockRepository = {
      findById: jest.fn().mockResolvedValue(entity)
    };
    const mockController: any = {
      repository: mockRepository
    };
    const withUserParam = withRequestParamFactory(mockParam, mockRequestParam, mockController, mockErrorCallback);
    const mockRequest = {};
    const mockResponse: any = {};
    const mockNext = jest.fn();

    await withUserParam(mockRequest, mockResponse, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalledWith(mockResponse, new NotFoundError().getError());
  });
});
