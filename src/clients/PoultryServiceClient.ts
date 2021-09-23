import axios, { AxiosInstance } from 'axios';
import { AppRequest, IPoultry, IPoultryUser, IUser } from '@cig-platform/types';

import { AppRequestErrorHandler } from '@Decorators/client';

interface PostPoultrySuccessRequest extends AppRequest {
  poultry: IPoultry;
  message: string;
}

interface PostPoultryUserSuccessRequest extends AppRequest {
  poultryUser: {
    id: string;
    userId: string;
    poultryId: string;
  }
  message: string;
}

interface GetPoultriesSuccessRequest extends AppRequest {
  poultries: IPoultry[]
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

  @AppRequestErrorHandler()
  async postPoultry(poultry: Partial<IPoultry>) {
    const response = await this._axiosClient.post<PostPoultrySuccessRequest>('/poultries', poultry);

    return response.data.poultry;
  }

  @AppRequestErrorHandler()
  async postPoultryUser(poultryUser: Partial<IPoultryUser>) {
    const response = await this._axiosClient.post<PostPoultryUserSuccessRequest>(
      `/poultries/${poultryUser?.poultryId ?? ''}/users`,
      { userId: poultryUser?.userId }
    );

    return response.data.poultryUser;
  }

  @AppRequestErrorHandler()
  async getPoultries(userId?: IUser['id']) {
    const params = {
      ...(userId ? { userId } : {})
    };

    const response = await this._axiosClient.get<GetPoultriesSuccessRequest>('/poultries', { params });

    return response.data.poultries;
  }
}
