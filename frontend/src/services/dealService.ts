import api from './api';
import { Pagination } from '../types';

export interface Deal {
  id: number;
  title: string;
  merchant: string;
  price?: number;
  original_price?: number;
  discount_percentage?: number;
  image_url?: string;
  affiliate_url?: string;
  category?: string;
  created_at?: string;
}

export interface DealResponse {
  deals: Deal[];
  pagination: Pagination;
}

export const dealService = {
  getDeals: async (params?: {
    page?: number;
    per_page?: number;
    merchant?: string;
    category?: string;
    sort?: string;
  }): Promise<DealResponse> => {
    const response = await api.get<DealResponse>('/deals', { params });
    return response.data;
  },
};
