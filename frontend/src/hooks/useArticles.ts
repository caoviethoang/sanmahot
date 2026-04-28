import { useQuery } from '@tanstack/react-query';
import type { ArticleParams } from '../services/articleService';
import { articleService } from '../services/articleService';

export const useArticles = (params: ArticleParams) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articleService.getArticles(params),
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleService.getArticle(slug),
    enabled: !!slug,
  });
};

export const useLatestArticles = (limit = 5) => {
  return useQuery({
    queryKey: ['latest-articles', limit],
    queryFn: () => articleService.getLatestArticles(limit),
  });
};
