import type { Coupon, PagedApiResponse } from '../types';
import api from './api';

export interface CouponParams {
  platform?: string;
  category?: string;
  sort?: string;
  q?: string;
  page?: number;
  per_page?: number;
}

export const couponService = {
  getCoupons: async (params: CouponParams = {}): Promise<PagedApiResponse<Coupon>> => {
    const response = await api.get<PagedApiResponse<Coupon>>('/coupons', { params });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/coupons/categories');
    return response.data;
  },

  getLatestCoupons: async (perPage = 9): Promise<PagedApiResponse<Coupon>> => {
    const response = await api.get<PagedApiResponse<Coupon>>('/coupons', {
      params: { per_page: perPage },
    });
    return response.data;
  },
};
