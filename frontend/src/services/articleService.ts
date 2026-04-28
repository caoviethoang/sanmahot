import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useLatestArticles = (perPage = 6) => {
  return useQuery({
    queryKey: ['latest-articles', perPage],
    queryFn: async () => {
      const response = await api.get(`/articles?per_page=${perPage}`);
      return response.data;
    },
  });
};

export const getArticles = async (params = {}) => {
  const response = await api.get('/articles', { params });
  return response.data;
};
