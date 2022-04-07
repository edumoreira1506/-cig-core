import axios, { AxiosInstance } from 'axios';
import {
  IMerchant,
  AppRequest,
  IAdvertising,
  IAdvertisingQuestion,
  IAdvertisingQuestionAnswer,
  IAdvertisingFavorite
} from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface PostMerchantSuccessRequest extends AppRequest {
  merchant: IMerchant;
  message: string;
}

interface PostAdvertisingSuccessRequest extends AppRequest {
  advertising: IAdvertising;
  message: string;
}

interface PostAdvertisingQuestionSuccessRequest extends AppRequest {
  message: string;
  advertisingQuestion: IAdvertisingQuestion;
}

interface PostAdvertisingQuestionAnswerSuccessRequest extends AppRequest {
  message: string;
  advertisingQuestionAnswer: IAdvertisingQuestionAnswer;
}

type IAdvertisingQuestionWithAnswer = IAdvertisingQuestion & {
  answers: IAdvertisingQuestionAnswer[]
}

interface GetAdvertisingQuestionsSuccessRequest extends AppRequest {
  message: string;
  questions: IAdvertisingQuestionWithAnswer[];
}

interface GetMerchantsSuccessRequest extends AppRequest {
  merchants: IMerchant[];
}

interface GetMerchantSuccessRequest extends AppRequest {
  merchant: IMerchant;
}

interface GetAdvertisingsSuccessRequest extends AppRequest {
  advertisings: IAdvertising[];
}

interface GetAdvertisingsSearchSuccessRequest extends GetAdvertisingsSuccessRequest {
  pages: number;
}

interface GetAdvertisingSuccessRequest extends AppRequest {
  advertising: IAdvertising;
}

interface GetAdvertisingFavoritesSuccessRequest extends AppRequest {
  favorites: IAdvertisingFavorite[];
}

interface GetFavoritesSuccessRequest extends AppRequest {
  favorites: IAdvertisingFavorite[];
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
    await this._axiosClient.post(`/v1/merchants/${merchantId}/rollback`);
  }

  @RequestErrorHandler()
  async removeAdvertising(merchantId: string, advertisingId: string) {
    await this._axiosClient.delete(`/v1/merchants/${merchantId}/advertisings/${advertisingId}`);
  }

  @RequestErrorHandler()
  async postAdvertising(merchantId: string, advertising: Partial<IAdvertising>) {
    const response = await this._axiosClient.post<PostAdvertisingSuccessRequest>(
      `/v1/merchants/${merchantId}/advertisings`,
      advertising
    );

    return response.data.advertising;
  }

  @RequestErrorHandler()
  async postAdvertisingQuestion(merchantId: string, advertisingId: string, question: Partial<IAdvertisingQuestion>) {
    const response = await this._axiosClient.post<PostAdvertisingQuestionSuccessRequest>(
      `/v1/merchants/${merchantId}/advertisings/${advertisingId}/questions`,
      question
    );

    return response.data.advertisingQuestion;
  }

  @RequestErrorHandler()
  async postAdvertisingFavorite(merchantId: string, advertisingId: string, externalId: string) {
    await this._axiosClient.post(
      `/v1/merchants/${merchantId}/advertisings/${advertisingId}/favorites`,
      { externalId }
    );
  }

  @RequestErrorHandler([])
  async getAdvertisingFavorites(merchantId: string, advertisingId: string) {
    const { data } = await this._axiosClient.get<GetAdvertisingFavoritesSuccessRequest>(`/v1/merchants/${merchantId}/advertisings/${advertisingId}/favorites`);

    return data.favorites;
  }

  @RequestErrorHandler()
  async removeAdvertisingFavorite(merchantId: string, advertisingId: string, favoriteId: string) {
    await this._axiosClient.delete(
      `/v1/merchants/${merchantId}/advertisings/${advertisingId}/favorites/${favoriteId}`,
    );
  }

  @RequestErrorHandler([])
  async getFavorites(externalId: string) {
    const response = await this._axiosClient.get<GetFavoritesSuccessRequest>(
      '/v1/favorites',
      { params: { externalId } }
    );

    return response.data.favorites;
  }

  @RequestErrorHandler([])
  async getAdvertisingQuestions(merchantId: string, advertisingId: string) {
    const response = await this._axiosClient.get<GetAdvertisingQuestionsSuccessRequest>(
      `/v1/merchants/${merchantId}/advertisings/${advertisingId}/questions`
    );

    return response.data.questions;
  }

  @RequestErrorHandler()
  async postAdvertisingQuestionAnswer(
    merchantId: string,
    advertisingId: string,
    questionId: string,
    answer: Partial<IAdvertisingQuestionAnswer>
  ) {
    const response = await this._axiosClient.post<PostAdvertisingQuestionAnswerSuccessRequest>(
      `/v1/merchants/${merchantId}/advertisings/${advertisingId}/questions/${questionId}/answers`,
      answer
    );

    return response.data.advertisingQuestionAnswer;
  }

  @RequestErrorHandler()
  async updateAdvertising(merchantId: string, advertisingId: string, price: number, finished?: boolean) {
    return this._axiosClient.patch( `/v1/merchants/${merchantId}/advertisings/${advertisingId}`, {
      price,
      ...(typeof finished === 'boolean' ? { finished } : {})
    });
  }

  @RequestErrorHandler([])
  async getMerchants(externalId = '') {
    const response = await this._axiosClient.get<GetMerchantsSuccessRequest>('/v1/merchants', {
      params: { externalId }
    });

    return response.data.merchants;
  }

  @RequestErrorHandler()
  async getMerchant(merchantId: string) {
    const response = await this._axiosClient.get<GetMerchantSuccessRequest>(`/v1/merchants/${merchantId}`);

    return response.data.merchant;
  }

  @RequestErrorHandler()
  async getAdvertising(merchantId: string, advertisingId: string) {
    const response = await this._axiosClient.get<GetAdvertisingSuccessRequest>(
      `/v1/merchants/${merchantId}/advertisings/${advertisingId}`
    );

    return response.data.advertising;
  }

  @RequestErrorHandler([])
  async getAdvertisings(merchandId: string, externalId = '', finished?: boolean) {
    const response = await this._axiosClient.get<GetAdvertisingsSuccessRequest>(
      `/v1/merchants/${merchandId}/advertisings`, {
        params: { externalId, ...(typeof finished === 'boolean' ? { finished } : {}) }
      }
    );

    return response.data.advertisings;
  }

  @RequestErrorHandler([])
  async searchAdvertisings({
    advertisingIds = [],
    sort,
    favoriteExternalId,
    gender = [],
    genderCategory = [],
    type = [],
    tail = [],
    dewlap = [],
    crest = [],
    description,
    name,
    prices
  }: {
    advertisingIds?: string[];
    sort?: string;
    favoriteExternalId?: string;
    gender?: string[];
    genderCategory?: string[];
    type?: string[];
    tail?: string[];
    dewlap?: string[];
    crest?: string[];
    description?: string;
    name?: string;
    prices?: { min: number; max: number };
  }) {
    const response = await this._axiosClient.get<GetAdvertisingsSearchSuccessRequest>(
      '/advertisings', {
        params: {
          ...(advertisingIds.length ? { advertisingIds: advertisingIds.join(',') } : {}),
          ...(tail.length ? { tail: tail.join(',') } : {}),
          ...(dewlap.length ? { dewlap: dewlap.join(',') } : {}),
          ...(crest.length ? { crest: crest.join(',') } : {}),
          ...(gender.length ? { gender: gender.join(',') } : {}),
          ...(genderCategory.length ? { genderCategory: genderCategory.join(',') } : {}),
          ...(type.length ? { type: type.join(',') } : {}),
          ...(favoriteExternalId ? { favoriteExternalId } : {}),
          ...(sort ? { sort } : {}),
          ...(name ? { name } : {}),
          ...(description ? { description } : {}),
          prices: typeof prices?.min === 'number' && typeof prices?.max === 'number' ? JSON.stringify(prices) : undefined,
        }
      }
    );

    return response.data;
  }
}
