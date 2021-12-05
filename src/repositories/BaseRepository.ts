import { FindManyOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ErrorHandler } from '@cig-platform/decorators';

interface BaseEntity {
  id: string;
  active: boolean;
}

export default class BaseRepository<T extends BaseEntity> extends Repository<T> {
  @ErrorHandler()
  findById(id: string) {
    return this.findOne({ id, active: true });
  }

  @ErrorHandler()
  findByField(fieldName: keyof T, fieldValue: any) {
    return this.findOne({ [fieldName]: fieldValue, active: true });
  }

  @ErrorHandler([])
  all(fields?: FindManyOptions<T>) {
    const originalWhere = fields?.where ?? {};
    const where = {
      ...(typeof originalWhere === 'string' ? {} : originalWhere),
      active: true,
    };

    return this.find({
      ...fields,
      where
    });
  }

  updateById(id: string, fields: QueryDeepPartialEntity<T>) {
    return this.update({ id }, fields);
  }
}
