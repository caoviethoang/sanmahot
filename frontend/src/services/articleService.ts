import api from './api';
import { Article, ArticleResponse } from '../types';

export const articleService = {
  getArticles: async (params?: {
    per_page?: number;
    page?: number;
    category?: string;
  }): Promise<ArticleResponse> => {
    const response = await api.get<ArticleResponse>('/articles', { params });
    return response.data;
  },

  getArticle: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${slug}`);
    return response.data;
  },
};
