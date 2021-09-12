import axios, { AxiosInstance } from 'axios';

interface AppRequest {
  ok: boolean;
}

interface GetUserRequest extends AppRequest {
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
    register: string;
    birthDate: string;
    active: boolean;
  }
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

  async getUser(userId: string) {
    try {
      const response = await this._axiosClient.get<GetUserRequest>(`/users/${userId}`);

      return response.data.user;
    } catch {
      return null;
    }
  }

  async authUser(email: string, password: string) {
    try {
      const response = await this._axiosClient.post<AuthUserRequest>('/auth', { email, password });

      return response.data.token;
    } catch {
      return null;
    }
  }
}
