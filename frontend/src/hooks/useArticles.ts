import { useQuery } from '@tanstack/react-query';
import { articleService } from '../services/articleService';

export function useArticles(params?: {
  per_page?: number;
  page?: number;
  category?: string;
}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articleService.getArticles(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleService.getArticle(slug),
    enabled: !!slug,
  });
}
