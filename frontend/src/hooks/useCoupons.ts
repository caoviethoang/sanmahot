import { useQuery } from '@tanstack/react-query';
import type { CouponParams } from '../services/couponService';
import { couponService } from '../services/couponService';

export const useCoupons = (params: CouponParams) => {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: () => couponService.getCoupons(params),
  });
};

export const useCouponCategories = () => {
  return useQuery({
    queryKey: ['coupon-categories'],
    queryFn: () => couponService.getCategories(),
  });
};

export const useLatestCoupons = (perPage = 9) => {
  return useQuery({
    queryKey: ['latest-coupons', perPage],
    queryFn: () => couponService.getLatestCoupons(perPage),
  });
};
