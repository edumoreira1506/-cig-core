import faker from 'faker';

import { IPoultryAddress } from '@Types/poultry';

export default function poultryAddressFactory({
  city = faker.address.cityName(),
  province = 'SP',
  street = faker.address.streetName(),
  zipcode = `${faker.datatype.number({ min: 10000, max: 99999 })}-${faker.datatype.number({ min: 100, max: 999 })}`,
  number = faker.datatype.number(1000),
}: Partial<IPoultryAddress> = {}): IPoultryAddress {
  return {
    city,
    province,
    street,
    zipcode,
    number,
  };
}
