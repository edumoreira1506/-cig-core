import axios, { AxiosInstance } from 'axios';
import { AppRequest, IBreeder, IBreederUser, IUser } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

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

interface GetBreederImagesSuccessRequest extends AppRequest {
  breederImages: {
    id: string;
    breederId: string;
    imageUrl: string;
  }[]
}

export default class PoultryServiceClient {
  _axiosClient: AxiosInstance;

  constructor(breederServiceUrl: string) {
    this._axiosClient = axios.create({
      baseURL: breederServiceUrl,
    });
  }

  @RequestErrorHandler()
  async postBreeder(breeder: Partial<IBreeder>) {
    const response = await this._axiosClient.post<PostBreederSuccessRequest>('/v1/breeders', breeder);

    return response.data.breeder;
  }

  @RequestErrorHandler()
  async postBreederUser(breederUser: Partial<IBreederUser>) {
    const response = await this._axiosClient.post<PostBreederUserSuccessRequest>(
      `/v1/breeders/${breederUser?.breederId ?? ''}/users`,
      { userId: breederUser?.userId }
    );

    return response.data.breederUser;
  }

  @RequestErrorHandler()
  updateBreeder(breederId: string, breeder: Partial<IBreeder>) {
    const formData = toFormData(breeder);

    return this._axiosClient.patch(`/v1/breeders/${breederId}`, formData, {
      headers: formData.getHeaders()
    });
  }

  @RequestErrorHandler()
  async getBreeders(userId?: IUser['id']) {
    const params = {
      ...(userId ? { userId } : {})
    };

    const response = await this._axiosClient.get<GetBreedersSuccessRequest>('/v1/breeders', { params });

    return response.data.breeders;
  }

  @RequestErrorHandler()
  async getBreeder(breederId: IBreeder['id']) {
    const response = await this._axiosClient.get<GetBreederSuccessRequest>(`/v1/breeders/${breederId}`);

    return response.data.breeder;
  }

  @RequestErrorHandler([])
  async getBreederImages(breederId: IBreeder['id']) {
    const response = await this._axiosClient.get<GetBreederImagesSuccessRequest>(`/v1/breeders/${breederId}/images`);

    return response.data.breederImages;
  }
}
