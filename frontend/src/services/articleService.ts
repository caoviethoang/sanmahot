import type { Article, PagedApiResponse } from '../types';
import api from './api';

export interface ArticleParams {
  page?: number;
  per_page?: number;
  category?: string;
  platform?: string;
}

export const articleService = {
  getArticles: async (params: ArticleParams = {}): Promise<PagedApiResponse<Article>> => {
    const response = await api.get<PagedApiResponse<Article>>('/articles', { params });
    return response.data;
  },

  getArticle: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${slug}`);
    return response.data;
  },

  getLatestArticles: async (limit = 5): Promise<PagedApiResponse<Article>> => {
    const response = await api.get<PagedApiResponse<Article>>('/articles', {
      params: { per_page: limit },
    });
    return response.data;
  },
};
