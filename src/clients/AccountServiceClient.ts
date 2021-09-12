import axios, { AxiosInstance } from 'axios';

import { IUser } from '../@types/user';
import { FindEntityErrorHandler } from '../decorators/repository';
import { AppRequest } from '../@types/request';
import { AppRequestErrorHandler } from '../decorators/client';

interface GetUserRequest extends AppRequest {
  user: IUser;
}

interface PostUserSuccessRequest extends AppRequest {
  user: IUser;
  message: string;
}

interface AuthUserRequest {
  message: string;
  token: string;
}

export default class AccountServiceClient {
  _axiosClient: AxiosInstance;

  constructor(accountServiceUrl: string) {
    this._axiosClient = axios.create({
      baseURL: accountServiceUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  @AppRequestErrorHandler()
  async postUser(user: Partial<IUser>) {
    const response = await this._axiosClient.post<PostUserSuccessRequest>('/users', user);

    return response.data.user;
  }

  @FindEntityErrorHandler()
  async getUser(userId: string) {
    const response = await this._axiosClient.get<GetUserRequest>(`/users/${userId}`);

    return response.data.user;
  }

  @FindEntityErrorHandler()
  async authUser(email: string, password: string) {
    const response = await this._axiosClient.post<AuthUserRequest>('/auth', { email, password });

    return response.data.token;
  }
}
