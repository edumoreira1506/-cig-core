import axios, { AxiosInstance } from 'axios';

import { IMerchant, AppRequest } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface PostMerchantSuccessRequest extends AppRequest {
  merchant: IMerchant;
  message: string;
}

interface GetMerchantsSuccessRequest extends AppRequest {
  merchants: IMerchant[];
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

  @RequestErrorHandler([])
  async getMerchants(externalId = '') {
    const response = await this._axiosClient.get<GetMerchantsSuccessRequest>('/v1/merchants', {
      params: { externalId }
    });

    return response.data.merchants;
  }
}
