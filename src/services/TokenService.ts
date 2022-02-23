import jwt from 'jsonwebtoken';
import { IAdvertisingFavorite, IBreeder, IMerchant, IUser } from '@cig-platform/types';

export default class TokenService {
  private encryptSecret: string;

  constructor(encryptSecret: string) {
    this.encryptSecret = encryptSecret;

    this.create = this.create.bind(this);
    this.open = this.open.bind(this);
  }

  async create(
    { email, id, name }: IUser,
    breeders: IBreeder[],
    merchant: IMerchant,
    favorites: IAdvertisingFavorite[],
  ): Promise<string> {
    return jwt.sign({ email, id, name, breeders, merchant, favorites }, this.encryptSecret, { expiresIn: '1d' });
  }

  open(token: string): Promise<Record<string, unknown>> {
    return new Promise ((resolve, reject) => {
      jwt.verify(token, this.encryptSecret, (error: any, decoded: any): void => {
        if (error) reject(error);

        return resolve(decoded);
      });
    });
  }
}
