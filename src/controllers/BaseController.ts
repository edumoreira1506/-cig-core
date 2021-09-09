import { Response } from 'express';
import { getCustomRepository, ObjectType } from 'typeorm';

import { ApiErrorType } from '@Types/errors';

export default class BaseController<T, I> {
  protected entity: ObjectType<T>;

  get repository(): I {
    const repository = getCustomRepository<I>(this.entity);

    return repository;
  }

  constructor(entityParam: ObjectType<T>) {
    this.entity = entityParam;
  }

  static successResponse(res: Response, payload: Record<string, unknown>): Response {
    return res.status(200).send({
      ok: true,
      ...payload
    });
  }

  static errorResponse(res: Response, error: ApiErrorType): Response {
    return res.status(400).send({
      ok: false,
      error
    });
  }

  static errorHandler() {
    return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const originalMethod = descriptor.value;
  
      descriptor.value = function(...args: any[]) {
        const response = args[1];

        try {
          const result = originalMethod.apply(this, args);
                  
          if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
            return result.catch((error: any) => BaseController.errorResponse(response, error?.getError?.() ?? error));
          }
  
          return result;
        } catch (error: any) {
          return BaseController.errorResponse(response, error?.getError?.() ?? error);
        }
      };
  
      return descriptor;
    };
  }

  static updateHandler(updateMessage: string) {
    return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const originalMethod = descriptor.value;

      descriptor.value = async function(...args: any[]) {
        const response = args[1];

        await originalMethod.apply(this, args);

        return BaseController.successResponse(response, { message: updateMessage });
      };

      return descriptor;
    };
  }

  static removeHandler(removeMessage: string) {
    return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function(...args: any[]) {
        const response = args[1];

        await originalMethod.apply(this, args);

        return BaseController.successResponse(response, { message: removeMessage });
      };

      return descriptor;
    };
  }
}
