import faker from 'faker';

import { IUser } from '@Types/user';

export default function userFactory({
  id = faker.datatype.uuid(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  name = faker.name.findName(),
  birthDate = faker.date.past(),
  register = `${faker.datatype.number({ min: 100, max: 999 })}.${faker.datatype.number({ min: 100, max: 999 })}.${faker.datatype.number({ min: 100, max: 999 })}-${faker.datatype.number({ min: 10, max: 99 })}`
}: Partial<IUser> = {}): IUser {
  const confirmPassword = password;

  return {
    id,
    email,
    password,
    name,
    register,
    birthDate,
    confirmPassword,
  };
}
