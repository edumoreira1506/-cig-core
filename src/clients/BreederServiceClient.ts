import axios, { AxiosInstance } from 'axios';
import { AppRequest, IBreeder, IBreederUser, IUser } from '@cig-platform/types';

import { AppRequestErrorHandler } from '@Decorators/client';
import { toFormData } from '@Utils/form';

interface PostBreederSuccessRequest extends AppRequest {
  breeder: IBreeder;
  message: string;
}

interface PostBreederUserSuccessRequest extends AppRequest {
  breederUser: {
    id: string;
    userId: string;
    breederId: string;
  }
  message: string;
}

interface GetBreedersSuccessRequest extends AppRequest {
  breeders: IBreeder[]
}

interface GetBreederSuccessRequest extends AppRequest {
  breeder: IBreeder;
}

export default class BreederServiceClient {
  _axiosClient: AxiosInstance;

  constructor(breederServiceUrl: string) {
    this._axiosClient = axios.create({
      baseURL: breederServiceUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  @AppRequestErrorHandler()
  async postBreeder(breeder: Partial<IBreeder>) {
    const response = await this._axiosClient.post<PostBreederSuccessRequest>('/breeders', breeder);

    return response.data.breeder;
  }

  @AppRequestErrorHandler()
  async postBreederUser(breederUser: Partial<IBreederUser>) {
    const response = await this._axiosClient.post<PostBreederUserSuccessRequest>(
      `/breeders/${breederUser?.breederId ?? ''}/users`,
      { userId: breederUser?.userId }
    );

    return response.data.breederUser;
  }

  @AppRequestErrorHandler()
  updateBreeder(breederId: string, breeder: Partial<IBreeder>) {
    return this._axiosClient.patch(`/breeders/${breederId}`, toFormData(breeder));
  }

  @AppRequestErrorHandler()
  async getBreeders(userId?: IUser['id']) {
    const params = {
      ...(userId ? { userId } : {})
    };

    const response = await this._axiosClient.get<GetBreedersSuccessRequest>('/breeders', { params });

    return response.data.breeders;
  }

  @AppRequestErrorHandler()
  async getBreeder(breederId: IBreeder['id']) {
    const response = await this._axiosClient.get<GetBreederSuccessRequest>(`/breeders/${breederId}`);

    return response.data.breeder;
  }
}
