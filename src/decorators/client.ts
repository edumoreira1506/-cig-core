import axios from 'axios';
import { ErrorRequest } from '@cig-platform/types';

export const AppRequestErrorHandler = () => {
  return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);
                
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
          return result.catch((error: any) => {
            if (axios.isAxiosError(error))  {
              const response = error?.response?.data ?? {} as ErrorRequest;

              throw response.error;
            }
      
            return undefined;
          });
        }

        return result;
      } catch (error) {
        if (axios.isAxiosError(error))  {
          const response = error?.response?.data ?? {} as ErrorRequest;
  
          throw response.error;
        }
  
        return undefined;
      }
    };

    return descriptor;
  };
};
