// src/types/index.ts

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface Coupon {
  id: number;
  platform: string;
  title: string;
  description: string;
  code: string;
  affiliate_url: string;
  discount_value?: number | null;
  min_order_value?: number | null;
  start_at?: string | null;
  end_at?: string | null;
  category?: string | null;
  terms?: string | null;
  target_users?: string | null;
  is_hot: boolean;
  status: 'active' | 'inactive' | 'expired';
}

export interface Deal {
  id: number;
  title: string;
  description: string;
  merchant_name: string;
  source_platform: string;
  image_url: string;
  affiliate_url: string;
  original_price?: number | null;
  sale_price?: number | null;
  discount_percent?: number | null;
  start_at?: string | null;
  expired_at?: string | null;
  status: 'active' | 'inactive' | 'expired';
  is_hot: boolean;
  category?: {
    id: number;
    name: string;
  } | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  published_at: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PagedApiResponse<T> {
  coupons?: T[];
  deals?: T[];
  articles?: T[];
  pagination: Pagination;
}
