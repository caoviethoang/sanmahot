import api from './api';
import { Coupon, CouponResponse } from '../types';

export const couponService = {
  getCoupons: async (params?: {
    platform?: string;
    per_page?: number;
    page?: number;
    sort?: string;
  }): Promise<CouponResponse> => {
    const response = await api.get<CouponResponse>('/coupons', { params });
    return response.data;
  },

  getAdminCoupons: async (): Promise<Coupon[]> => {
    const response = await api.get<Coupon[]>('/admin/coupons');
    return response.data;
  },

  deleteCoupon: async (id: number): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`);
  },

  getCouponCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/coupons/categories');
    return response.data;
  },
};
