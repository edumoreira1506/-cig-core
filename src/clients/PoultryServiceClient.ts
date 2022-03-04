import axios, { AxiosInstance } from 'axios';
import {
  AppRequest,
  IBreeder,
  IBreederUser,
  IPoultry,
  IUser,
  IBreederContact,
  IPoultryRegister
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

interface GetBreedersContactsSuccessRequest extends AppRequest {
  contacts: IBreederContact;
}

interface PostPoultrySuccessRequest extends AppRequest {
  poultry: IPoultry;
}

interface GetBreedersSuccessRequest extends AppRequest {
  breeders: IBreeder[]
}

interface GetRegistersSuccessRequest extends AppRequest {
  registers: IPoultryRegister[];
}

interface GetContactsSuccessRequest extends AppRequest {
  contacts: IBreederContact[];
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

interface GetPoultryImagesSuccessRequest extends AppRequest {
  poultryImages: {
    id: string;
    poultryId: string;
    imageUrl: string;
  }[]
}

interface Poultry extends IPoultry {
  mainImage: string;
  breederId: string;
}

interface GetPoultriesSuccessRequest extends AppRequest {
  pages: number;
  poultries: Poultry[];
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
  async rollbackBreederUser(breederId: string, breederUserId: string) {
    await this._axiosClient.post(`/v1/breeders/${breederId}/users/${breederUserId}/rollback`);
  }

  @RequestErrorHandler()
  updateBreeder(breederId: string, breeder: Partial<IBreeder>) {
    const formData = toFormData(breeder);

    return this._axiosClient.patch(`/v1/breeders/${breederId}`, formData, {
      headers: formData.getHeaders()
    });
  }

  @RequestErrorHandler()
  postRegister(breederId: string, poultryId: string, register: Partial<IPoultryRegister>, files: File[]) {
    const formData = toFormData({ ...register, files });

    return this._axiosClient.post(`/v1/breeders/${breederId}/poultries/${poultryId}/registers`, formData, {
      headers: formData.getHeaders()
    });
  }

  @RequestErrorHandler()
  transferPoultry(breederId: string, poultryId: string, targetBreederId: string) {
    return this._axiosClient.post(`/v1/breeders/${breederId}/poultries/${poultryId}/transfer`, {
      breederId: targetBreederId
    });
  }

  @RequestErrorHandler([])
  async getRegisters(breederId: string, poultryId: string, registerType = '') {
    const response = await this._axiosClient.get<GetRegistersSuccessRequest>(
      `/v1/breeders/${breederId}/poultries/${poultryId}/registers`,
      { params: { registerType } }
    );

    return response.data.registers;
  }

  @RequestErrorHandler()
  async getBreeders(userId?: IUser['id'], keyword = '') {
    const params = {
      ...(userId ? { userId } : {}),
      ...(keyword ? { keyword } : {}),
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

  @RequestErrorHandler([])
  async getPoultryImages(breederId: IBreeder['id'], poultryId: IPoultry['id']) {
    const response = await this._axiosClient.get<GetPoultryImagesSuccessRequest>(`/v1/breeders/${breederId}/poultries/${poultryId}/images`);

    return response.data.poultryImages;
  }

  async removeBreederImage(breederId: string, breederImageId: string) {
    return this._axiosClient.delete(`/v1/breeders/${breederId}/images/${breederImageId}`);
  }

  async removePoultryImage(breederId: string, poultryId: string, imageId: string) {
    return this._axiosClient.delete(`/v1/breeders/${breederId}/poultries/${poultryId}/images/${imageId}`); 
  }

  @RequestErrorHandler()
  async postBreederContact(breederId: string, contact: Partial<IBreederContact>) {
    const response = await this._axiosClient.post<PostBreederContactSuccessRequest>(
      `/v1/breeders/${breederId}/contacts`,
      contact
    );

    return response.data.contact;
  }

  @RequestErrorHandler([])
  async getBreederContacts(breederId: string) {
    const response = await this._axiosClient.get<GetBreedersContactsSuccessRequest>(`/v1/breeders/${breederId}/contacts`,);

    return response.data.contacts;
  }

  @RequestErrorHandler()
  async removeBreederContact(breederId: string, contactId: string) {
    return this._axiosClient.delete(`/v1/breeders/${breederId}/contacts/${contactId}`); 
  }

  @RequestErrorHandler([])
  async getContacts(breederId: string) {
    const response = await this._axiosClient.get<GetContactsSuccessRequest>(
      `/v1/breeders/${breederId}/contacts`,
    );

    return response.data.contacts;
  }

  @RequestErrorHandler()
  async updateBreederContact(breederId: string, contactId: string, contact: Partial<IBreederContact>) {
    return this._axiosClient.patch(`/v1/breeders/${breederId}/poultries/${contactId}`, contact);
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

  async postPoultryImages(breederId: string, poultryId: string, images: File[]) {
    const formData = new FormData();

    images.forEach((image: any) => {
      formData.append('files', image.buffer, { filename: image.originalname });
    });

    return this._axiosClient.post(`/v1/breeders/${breederId}/poultries/${poultryId}/images`, formData, {
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


  @RequestErrorHandler()
  async getPoultryDirectly(poultryId: string) {
    const response = await this._axiosClient.get<GetPoultrySuccessRequest>(`/v1/poultries/${poultryId}`);

    return response.data.poultry;
  }

  @RequestErrorHandler()
  async rollbackBreeder(breederId: string) {
    await this._axiosClient.post(`/v1/breeders/${breederId}/rollback`);
  }

  @RequestErrorHandler([])
  async getPoultries(breederId: IBreeder['id'], {
    gender = '',
    genderCategory = '',
    poultryIds = ''
  }) {
    const response = await this._axiosClient.get<GetPoultriesSuccessRequest>(
      `/v1/breeders/${breederId}/poultries`,
      { params: { gender, genderCategory, poultryIds } }
    );

    return response.data.poultries;
  }

  @RequestErrorHandler([])
  async findPoultries({
    gender = [] as string[],
    genderCategory = [] as string[],
    poultryIds = '',
    dewlap = [] as string[],
    tail = [] as string[],
    crest = [] as string[],
    type = [] as string[],
    description = '',
    name = '',
    forSale = '',
    prices,
    sort = '',
    page
  }: {
    gender?: string[];
    genderCategory?: string[];
    poultryIds?: string;
    dewlap?: string[];
    tail?: string[];
    crest?: string[];
    type?: string[];
    description?: string;
    name?: string;
    forSale?: string;
    prices?: { min: number; max: number };
    sort?: string;
    page?: number;
  }) {
    const response = await this._axiosClient.get<GetPoultriesSuccessRequest>(
      '/v1/poultries',
      {
        params: {
          gender: gender.filter(Boolean).length ? gender.filter(Boolean).join(',') : undefined,
          genderCategory: genderCategory.filter(Boolean).length ? genderCategory.filter(Boolean).join(',') : undefined,
          poultryIds,
          dewlap: dewlap.filter(Boolean).length ? dewlap.filter(Boolean).join(',') : undefined,
          tail: tail.filter(Boolean).length ? tail.filter(Boolean).join(',') : undefined,
          crest: crest.filter(Boolean).length ? crest.filter(Boolean).join(',') : undefined,
          type: type.filter(Boolean).length ? type.filter(Boolean).join(',') : undefined,
          description,
          name,
          forSale,
          prices: typeof prices?.min === 'number' && typeof prices?.max === 'number' ? JSON.stringify(prices) : undefined,
          sort,
          page: typeof page === 'number' ? page.toString() : undefined
        }
      }
    );

    return response.data;
  }
}
