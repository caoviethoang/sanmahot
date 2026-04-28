import { useQuery } from '@tanstack/react-query';
import type { DealParams } from '../services/dealService';
import { dealService } from '../services/dealService';

export const useDeals = (params: DealParams) => {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => dealService.getDeals(params),
  });
};

export const useDeal = (slug: string) => {
  return useQuery({
    queryKey: ['deal', slug],
    queryFn: () => dealService.getDeal(slug),
    enabled: !!slug,
  });
};

export const useLatestDeals = (perPage = 8) => {
  return useQuery({
    queryKey: ['latest-deals', perPage],
    queryFn: () => dealService.getLatestDeals(perPage),
  });
};
