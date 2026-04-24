import { useQuery } from '@tanstack/react-query';
import { couponService } from '../services/couponService';

export function useCoupons(params?: {
  platform?: string;
  per_page?: number;
  page?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: () => couponService.getCoupons(params),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin_coupons'],
    queryFn: () => couponService.getAdminCoupons(),
  });
}

export function useCouponCategories() {
  return useQuery({
    queryKey: ['coupon_categories'],
    queryFn: () => couponService.getCouponCategories(),
  });
}
