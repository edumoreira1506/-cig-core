import { FindManyOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type CustomRepository<T> = {
  findById: (id: string) => Promise<T | undefined>;
  findByField: (fieldName: string, fieldValue: any) => Promise<T | undefined>;
  all: (fields?: FindManyOptions<T>) => Promise<T[]>;
  updateById: (id: string, fields: QueryDeepPartialEntity<T>) => Promise<void>;
} & Repository<T>;

export const BaseRepositoryFunctionsGenerator = <T>() => ({
  findById(id: string) {
    return this.findOne({
      where: {
        id,
        active: true
      } as any
    });
  },
  findByField(fieldName: string, fieldValue: any) {
    return this.findOne({
      where: {
        [fieldName]: fieldValue,
        active: true
      } as any
    });
  },
  all(fields?: FindManyOptions<T>) {
    const originalWhere = fields?.where ?? {};
    const where = {
      ...(typeof originalWhere === 'string' ? {} : originalWhere),
      active: true,
    } as any;

    return this.find({
      ...fields,
      where,
    });
  },
  async updateById(id: string, fields: QueryDeepPartialEntity<T>) {
    await this.update({ id } as any, fields);
  }
} as CustomRepository<T>);
