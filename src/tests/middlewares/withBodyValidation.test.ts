import Joi from 'joi';

import { withBodyValidationFactory } from '../../middlewares/withBodyValidation';

describe('withBodyValidation', () => {
  it('validates the object', () => {
    const mockErrorCallback = jest.fn();
    const mockSchema = Joi.object({
      foo: Joi.string().required(),
    });
    const withBodyValidation = withBodyValidationFactory(mockErrorCallback)(mockSchema);

    const mockRequest: any = {
      body: {
        foo: null
      }
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    withBodyValidation(mockRequest, mockResponse, mockNext);

    expect(mockErrorCallback).toHaveBeenCalledWith(mockResponse, { message: '"foo" must be a string', name: 'ValidationError', });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next', () => {
    const mockErrorCallback = jest.fn();
    const mockSchema = Joi.object({
      foo: Joi.string().required(),
    });
    const withBodyValidation = withBodyValidationFactory(mockErrorCallback)(mockSchema);

    const mockRequest: any = {
      body: {
        foo: 'Valid foo'
      }
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    withBodyValidation(mockRequest, mockResponse, mockNext);

    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
