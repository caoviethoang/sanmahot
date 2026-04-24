export interface Pagination {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

export interface Coupon {
  id: number;
  title: string;
  platform: string;
  code: string;
  end_at?: string;
  description?: string;
  min_order_value?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  image_url?: string;
  category?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CouponResponse {
  coupons: Coupon[];
  pagination: Pagination;
}

export interface ArticleResponse {
  articles: Article[];
  pagination: Pagination;
}
