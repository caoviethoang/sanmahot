import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useLatestCoupons = (perPage = 9) => {
  return useQuery({
    queryKey: ['latest-coupons', perPage],
    queryFn: async () => {
      const response = await api.get(`/coupons?per_page=${perPage}`);
      return response.data;
    },
  });
};

export const getCoupons = async (params = {}) => {
  const response = await api.get('/coupons', { params });
  return response.data;
};
