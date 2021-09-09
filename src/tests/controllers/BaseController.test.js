import BaseController from '@Controllers/BaseController';

describe('BaseController', () => {
  describe('actionHandler', () => {
    it('calls BaseController.successResponse after the function executes', async () => {
      const mockSuccessResponse = jest.fn();
      const mockRequest = {};
      const mockResponse = {};
      const mockExampleMessage = 'example message';

      jest.spyOn(BaseController, 'successResponse').mockImplementation(mockSuccessResponse);

      class ExampleClass {
        @BaseController.actionHandler(mockExampleMessage)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static foo(_request, _response) {
          return;
        }
      }

      await ExampleClass.foo(mockRequest, mockResponse);

      expect(mockSuccessResponse).toHaveBeenCalledWith(mockResponse, { message: mockExampleMessage });
    });
  });

  describe('errorHandler', () => {
    it('calls BaseController.errorResponse when the function triggers an error', async () => {
      const mockErrorResponse = jest.fn();
      const mockRequest = {};
      const mockResponse = {};
      const mockError = new Error('Example error');

      jest.spyOn(BaseController, 'errorResponse').mockImplementation(mockErrorResponse);

      class ExampleClass {
        @BaseController.errorHandler()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static foo(_request, _response) {
          throw mockError;
        }
      }

      await ExampleClass.foo(mockRequest, mockResponse);

      expect(mockErrorResponse).toHaveBeenCalledWith(mockResponse, mockError);
    });
  });
});
