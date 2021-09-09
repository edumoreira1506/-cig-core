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
});
