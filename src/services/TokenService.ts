import jwt from 'jsonwebtoken';
import { IBreeder, IUser } from '@cig-platform/types';

export default class TokenService {
  private encryptSecret: string;

  constructor(encryptSecret: string) {
    this.encryptSecret = encryptSecret;

    this.create = this.create.bind(this);
    this.open = this.open.bind(this);
  }

  async create({ email, id, name }: Required<IUser>, breeders: Required<IBreeder>[]): Promise<string> {
    return jwt.sign({ email, id, name, breeders }, this.encryptSecret, { expiresIn: '1d' });
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