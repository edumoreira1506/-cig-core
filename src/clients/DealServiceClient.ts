import axios, { AxiosInstance } from 'axios';
import { AppRequest, IDeal, IDealEvent } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface PostDealSuccessRequest extends AppRequest {
  deal: IDeal;
}

interface GetDealsSuccessRequest extends AppRequest {
  deals: IDeal[];
}

interface GetDealSuccessRequest extends AppRequest {
  deal: IDeal;
}

interface PostDealEventSuccessRequest extends AppRequest {
  event: IDealEvent;
}

interface GetDealEventsSuccessRequest extends AppRequest {
  events: IDealEvent[];
}

export default class PoultryServiceClient {
  _axiosClient: AxiosInstance;

  constructor(dealServiceUrl: string) {
    this._axiosClient = axios.create({
      baseURL: dealServiceUrl,
    });
  }

  @RequestErrorHandler()
  async registerDeal(deal: Partial<IDeal>) {
    const { data } = await this._axiosClient.post<PostDealSuccessRequest>('/v1/deals', deal);

    return data.deal;
  }

  @RequestErrorHandler()
  async updateDeal(dealId: string, deal: Partial<IDeal>) {
    await this._axiosClient.patch(`/v1/deals/${dealId}`, deal);
  }

  @RequestErrorHandler([])
  async getDeals({ sellerId, buyerId }: { sellerId?: string, buyerId?: string } = {}) {
    const { data } = await this._axiosClient.get<GetDealsSuccessRequest>(
      `/v1/deals?${[
        sellerId ? `sellerId=${sellerId}` : undefined,
        buyerId ? `buyerId=${buyerId}` : undefined]
        .filter(Boolean).join('&')}`
    );

    return data.deals;
  }

  @RequestErrorHandler()
  async getDeal(dealId: string) {
    const { data } = await this._axiosClient.get<GetDealSuccessRequest>(`/v1/deals/${dealId}`);

    return data.deal;
  }

  @RequestErrorHandler()
  async registerDealEvent(dealId: string, dealEvent: Partial<IDealEvent>) {
    const { data } = await this._axiosClient.post<PostDealEventSuccessRequest>(`/v1/deals/${dealId}/events`, dealEvent);

    return data.event;
  }

  @RequestErrorHandler([])
  async getDealEvents(dealId: string) {
    const { data } = await this._axiosClient.get<GetDealEventsSuccessRequest>(`/v1/deals/${dealId}/events`);

    return data.events;
  }
}
