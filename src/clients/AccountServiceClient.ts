import axios, { AxiosInstance } from 'axios';
import { IUser, AppRequest } from '@cig-platform/types';

import { AppRequestErrorHandler } from '@Decorators/client';

interface GetUserRequest extends AppRequest {
  user: IUser;
}

interface GetUsersRequest extends AppRequest {
  users: IUser[];
}

interface PostUserSuccessRequest extends AppRequest {
  user: IUser;
  message: string;
}

interface AuthUserRequest extends AppRequest {
  message: string;
  user: Required<IUser>;
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
    const response = await this._axiosClient.post<PostUserSuccessRequest>('/v1/users', user);

    return response.data.user;
  }

  @AppRequestErrorHandler()
  async getUser(userId: string) {
    const response = await this._axiosClient.get<GetUserRequest>(`/v1/users/${userId}`);

    return response.data.user;
  }

  @AppRequestErrorHandler()
  async authUser(email: string, password: string) {
    const response = await this._axiosClient.post<AuthUserRequest>('/v1/auth', { email, password });

    return response.data.user;
  }

  @AppRequestErrorHandler([])
  async getUsers({ email }: { email?: string } = {}) {
    const response = await this._axiosClient.get<GetUsersRequest>('/v1/users', { params: { email } });

    return response.data.users;
  }
}
