import { useQuery } from '@tanstack/react-query';
import { dealService } from '../services/dealService';

export function useDeals(params?: {
  page?: number;
  per_page?: number;
  merchant?: string;
  category?: string;
  sort?: string;
}) {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => dealService.getDeals(params),
  });
}
