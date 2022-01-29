import axios, { AxiosInstance } from 'axios';
import {
  IMerchant,
  AppRequest,
  IAdvertising,
  IAdvertisingQuestion,
  IAdvertisingQuestionAnswer,
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

interface GetAdvertisingSuccessRequest extends AppRequest {
  advertising: IAdvertising;
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
  async updateAdvertising(merchantId: string, advertisingId: string, price: number) {
    return this._axiosClient.patch( `/v1/merchants/${merchantId}/advertisings/${advertisingId}`, { price });
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
  async getAdvertisings(merchandId: string, externalId = '') {
    const response = await this._axiosClient.get<GetAdvertisingsSuccessRequest>(`/v1/merchants/${merchandId}/advertisings`, {
      params: { externalId }
    });

    return response.data.advertisings;
  }
}
