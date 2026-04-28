import type { Deal, PagedApiResponse } from '../types';
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
  getDeals: async (params: DealParams = {}): Promise<PagedApiResponse<Deal>> => {
    const response = await api.get<PagedApiResponse<Deal>>('/deals', { params });
    return response.data;
  },

  getDeal: async (slug: string): Promise<Deal> => {
    const response = await api.get<Deal>(`/deals/${slug}`);
    return response.data;
  },

  getLatestDeals: async (perPage = 8): Promise<PagedApiResponse<Deal>> => {
    const response = await api.get<PagedApiResponse<Deal>>('/deals', {
      params: { per_page: perPage },
    });
    return response.data;
  },
};
