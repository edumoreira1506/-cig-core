import axios, { AxiosInstance } from 'axios';
import { AppRequest, IDeal, IDealEvent } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface PostDealSuccessRequest extends AppRequest {
  deal: IDeal;
}

interface GetDealsSuccessRequest extends AppRequest {
  deals: IDeal[];
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
    const { data } = await this._axiosClient.post<PostDealSuccessRequest>('/deals', deal);

    return data.deal;
  }

  @RequestErrorHandler([])
  async getDeals({ sellerId, buyerId }: { sellerId?: string, buyerId?: string } = {}) {
    const { data } = await this._axiosClient.get<GetDealsSuccessRequest>(`/deals?sellerId=${sellerId}&buyerId=${buyerId}`);

    return data.deals;
  }

  @RequestErrorHandler()
  async registerDealEvent(dealId: string, dealEvent: Partial<IDealEvent>) {
    const { data } = await this._axiosClient.post<PostDealEventSuccessRequest>(`/deals/${dealId}/events`, dealEvent);

    return data.event;
  }

  @RequestErrorHandler([])
  async getDealEvents(dealId: string) {
    const { data } = await this._axiosClient.get<GetDealEventsSuccessRequest>(`/deals/${dealId}/events`);

    return data.events;
  }
}
