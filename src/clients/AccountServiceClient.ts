import axios, { AxiosInstance } from 'axios';

interface GetUserRequest {
  ok: boolean;
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

  getUser(userId: string) {
    try {
      return this._axiosClient.get<GetUserRequest>(`/users/${userId}`);
    } catch {
      return null;
    }
  }
}
