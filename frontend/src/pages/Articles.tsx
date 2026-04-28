import { ArrowRight, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ListSkeleton } from '../components/ui/LoadingSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { useArticles } from '../hooks/useArticles';
import { formatDate } from '../lib/utils';
import type { Article } from '../types';

export default function Articles() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArticles({
    page,
    per_page: 10,
  });

  const articles = data?.articles;
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Helmet>
        <title>Tin hot & Mẹo săn Deal mới nhất | SanMaHot</title>
        <meta
          name="description"
          content="Tổng hợp tin tức khuyến mãi sớm nhất, mẹo săn mã giảm giá, hướng dẫn mua sắm cực hời tại Shopee, Lazada, Tiki."
        />
      </Helmet>

      <div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 uppercase">
          TIN HOT <span className="text-orange-600 block sm:inline">& MẸO SĂN DEAL</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg max-w-2xl">
          Đừng bỏ lỡ bất kỳ chương trình khuyến mãi nào. Chúng tôi mang đến cho bạn những thông tin
          mới nhất và mẹo mua sắm hữu ích nhất.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={10} />
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {articles?.map((article: Article) => (
            <Link key={article.id} to={`/tin-khuyen-mai/${article.slug}`} className="block group">
              <Card className="overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 rounded-3xl bg-white shadow-sm">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 aspect-[16/9] md:aspect-auto overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                        <span className="text-orange-200 text-xs font-black uppercase">
                          Article
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                          {article.category || 'Mẹo săn deal'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(article.published_at)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          Admin
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight mb-4">
                        {article.title}
                      </h2>
                      <p className="text-gray-500 text-sm sm:text-base leading-relaxed line-clamp-2 md:line-clamp-3">
                        {article.description}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-orange-600 font-extrabold text-sm uppercase group-hover:gap-4 transition-all">
                      Đọc tiếp <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
          {articles?.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              Chưa có tin khuyến mãi nào được đăng tải.
            </div>
          )}
        </div>
      )}

      {pagination && (
        <Pagination currentPage={page} totalPages={pagination.total_pages} onPageChange={setPage} />
      )}
    </div>
  );
}
