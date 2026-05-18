import type { Deal, DealsResponse } from '../types';
import api from './api';

export interface DealParams {
  platform?: string;
  category_id?: number | string;
  sort?: string;
  q?: string;
  page?: number;
  per_page?: number;
}

export const dealService = {
  getDeals: async (params: DealParams = {}): Promise<DealsResponse> => {
    const response = await api.get<DealsResponse>('/deals', { params });
    return response.data;
  },

  getDeal: async (slug: string): Promise<Deal> => {
    const response = await api.get<Deal>(`/deals/${slug}`);
    return response.data;
  },

  getLatestDeals: async (perPage = 8): Promise<DealsResponse> => {
    const response = await api.get<DealsResponse>('/deals', {
      params: { per_page: perPage },
    });
    return response.data;
  },
};
