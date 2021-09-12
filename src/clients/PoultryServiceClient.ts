import axios, { AxiosInstance } from 'axios';

import { AppRequest, ErrorRequest } from '@Types/request';
import { IPoultry, IPoultryUser } from '@Types/poultry';

interface PostPoultrySuccessRequest extends AppRequest {
  poultry: IPoultry;
  message: string;
}

export default class PoultryServiceClient {
  _axiosClient: AxiosInstance;

  constructor(poultryServiceUrl: string) {
    this._axiosClient = axios.create({
      baseURL: poultryServiceUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  async postPoultry(poultry: Partial<IPoultry>) {
    try {
      const response = await this._axiosClient.post<PostPoultrySuccessRequest>('/poultries', poultry);

      return response.data.poultry;
    } catch (error) {
      if (axios.isAxiosError(error))  {
        const response = error?.response?.data ?? {} as ErrorRequest;

        throw response.error;
      }

      return undefined;
    }
  }

  async postPoultryUser(poultryUser: Partial<IPoultryUser>) {
    try {
      const response = await this._axiosClient.post<PostPoultrySuccessRequest>(`/poultries/${poultryUser?.poultryId ?? ''}/users`, { userId: poultryUser?.userId });

      return response.data.poultry;
    } catch (error) {
      if (axios.isAxiosError(error))  {
        const response = error?.response?.data ?? {} as ErrorRequest;

        throw response.error;
      }

      return undefined;
    }
  }
}
