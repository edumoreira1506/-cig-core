import axios, { AxiosInstance } from 'axios';

import { IMerchant, AppRequest, IAdvertising } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface PostMerchantSuccessRequest extends AppRequest {
  merchant: IMerchant;
  message: string;
}

interface PostAdvertisingSuccessRequest extends AppRequest {
  advertising: IAdvertising;
  message: string;
}

interface GetMerchantsSuccessRequest extends AppRequest {
  merchants: IMerchant[];
}

interface GetAdvertisingsSuccessRequest extends AppRequest {
  advertisings: IAdvertising[];
}

export default class AdvertisingServiceClient {
  _axiosClient: AxiosInstance;

  constructor(advertisingServiceUrl: string) {
    this._axiosClient = axios.create({
      baseURL: advertisingServiceUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  @RequestErrorHandler()
  async postMerchant(merchant: Partial<IMerchant>) {
    const response = await this._axiosClient.post<PostMerchantSuccessRequest>('/v1/merchants', merchant);

    return response.data.merchant;
  }

  @RequestErrorHandler()
  async rollbackMerchant(merchantId: string) {
    await this._axiosClient.delete(`/v1/merchants/${merchantId}/rollback`);
  }

  @RequestErrorHandler()
  async postAdvertising(merchantId: string, advertising: Partial<IAdvertising>) {
    const response = await this._axiosClient.post<PostAdvertisingSuccessRequest>(
      `/v1/merchants/${merchantId}/advertisings`,
      advertising
    );

    return response.data.advertising;
  }

  @RequestErrorHandler([])
  async getMerchants(externalId = '') {
    const response = await this._axiosClient.get<GetMerchantsSuccessRequest>('/v1/merchants', {
      params: { externalId }
    });

    return response.data.merchants;
  }

  @RequestErrorHandler([])
  async getAdvertisings(merchandId: string, externalId = '') {
    const response = await this._axiosClient.get<GetAdvertisingsSuccessRequest>(`/v1/merchants/${merchandId}/advertisings`, {
      params: { externalId }
    });

    return response.data.advertisings;
  }
}
