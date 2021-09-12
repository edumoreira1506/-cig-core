import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { FindEntityErrorHandler } from '../decorators/repository';

interface BaseEntity {
  id: string;
  active: boolean;
}

export default class BaseRepository<T extends BaseEntity> extends Repository<T> {
  @FindEntityErrorHandler()
  findById(id: string) {
    return this.findOne({ id });
  }

  @FindEntityErrorHandler()
  findByField(fieldName: keyof T, fieldValue: any) {
    return this.findOne({ [fieldName]: fieldValue, active: true });
  }

  updateById(id: string, fields: QueryDeepPartialEntity<T>) {
    return this.update({ id }, fields);
  }
}
