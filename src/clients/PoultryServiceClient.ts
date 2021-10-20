import axios, { AxiosInstance } from 'axios';
import {
  AppRequest,
  IBreeder,
  IBreederUser,
  IPoultry,
  IUser,
  IBreederImage,
  IBreederContact
} from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';
import FormData from 'form-data';

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

interface PostBreederContactSuccessRequest extends AppRequest {
  contact: IBreederContact;
  message: string;
}

interface PostPoultrySuccessRequest extends AppRequest {
  poultry: IPoultry;
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

interface GetPoultriesSuccessRequest extends AppRequest {
  poultries: IPoultry[];
}

interface GetPoultrySuccessRequest extends AppRequest {
  poultry: IPoultry;
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

  async removeBreederImage(breederId: string, breederImageId: string) {
    return this._axiosClient.delete(`/v1/breeders/${breederId}/images/${breederImageId}`); 
  }

  @RequestErrorHandler()
  async postBreederContact(breederId: string, contact: Partial<IBreederImage>) {
    const response = await this._axiosClient.post<PostBreederContactSuccessRequest>(
      `/v1/breeders/${breederId}/contacts`,
      contact
    );

    return response.data.contact;
  }

  async postBreederImages(breederId: string, images: File[]) {
    const formData = new FormData();

    images.forEach((image: any) => {
      formData.append('files', image.buffer, { filename: image.originalname });
    });

    return this._axiosClient.post(`/v1/breeders/${breederId}/images`, formData, {
      headers: formData.getHeaders()
    });
  }

  @RequestErrorHandler()
  async postPoultry(breederId: string, poultry: IPoultry) {
    const response = await this._axiosClient.post<PostPoultrySuccessRequest>(
      `/v1/breeders/${breederId}/poultries`,
      poultry
    );

    return response.data.poultry;
  }

  @RequestErrorHandler()
  async updatePoultry(breederId: string, poultryId: string, poultry: Partial<IPoultry>) {
    return this._axiosClient.patch(`/v1/breeders/${breederId}/poultries/${poultryId}`, poultry);
  }

  @RequestErrorHandler()
  async getPoultry(breederId: string, poultryId: string) {
    const response = await this._axiosClient.get<GetPoultrySuccessRequest>(`/v1/breeders/${breederId}/poultries/${poultryId}`);

    return response.data.poultry;
  }

  @RequestErrorHandler([])
  async getPoultries(breederId: IBreeder['id']) {
    const response = await this._axiosClient.get<GetPoultriesSuccessRequest>(`/v1/breeders/${breederId}/poultries`);

    return response.data.poultries;
  }
}
