import { FindEntityErrorHandler } from '@Decorators/repository';

describe('Repository decorators', () => {
  describe('FindEntityErrorHandler', () => {
    it('returns undefined when trigger an error', () => {
      class ExampleClass {
        @FindEntityErrorHandler()
        static functionWithError() {
          throw new Error('error example');
        }
      }

      expect(ExampleClass.functionWithError()).toBeUndefined();
    });
  });
});
