import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, BookOpen } from 'lucide-react';
import { ListSkeleton } from '../components/ui/LoadingSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { useArticles } from '../hooks/useArticles';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { formatDate } from '../lib/utils';
import type { Article } from '../types';

export default function Guides() {
  const { searchParams, updateFilters } = useUrlFilters();
  const page = Number(searchParams.get('page')) || 1;
  const platform = searchParams.get('platform') ?? undefined;

  const { data, isLoading } = useArticles({
    page,
    per_page: 12,
    category: 'Hướng Dẫn',
    platform,
  });

  const guides = data?.articles;
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Helmet>
        <title>Hướng Dẫn Mua Sắm & Mẹo Săn Deal | SanMaHot</title>
        <meta
          name="description"
          content="Kinh nghiệm săn mã giảm giá, cách sử dụng voucher và các thủ thuật mua hàng tiết kiệm nhất tại Shopee, Lazada, Tiki."
        />
      </Helmet>

      <div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 uppercase">
          HƯỚNG DẪN <span className="text-orange-600 block sm:inline">MUA SẮM</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg max-w-2xl mb-10">
          Kinh nghiệm săn mã giảm giá, cách sử dụng voucher và các thủ thuật mua hàng tiết kiệm
          nhất.
        </p>

        <div className="flex flex-wrap gap-4">
          {[
            { id: undefined, label: 'Tất cả' },
            { id: 'shopee', label: 'Shopee' },
            { id: 'lazada', label: 'Lazada' },
            { id: 'tiki', label: 'Tiki' },
          ].map((item) => (
            <Button
              key={item.id || 'all'}
              variant={platform === item.id ? 'default' : 'outline'}
              onClick={() => updateFilters({ platform: item.id ?? null })}
              className={`rounded-full px-8 font-black text-xs uppercase tracking-widest h-12 transition-all ${
                platform === item.id
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 border-none'
                  : 'border-gray-200 text-gray-400 hover:border-orange-200 hover:text-orange-600'
              }`}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ListSkeleton count={12} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides?.map((guide: Article) => (
            <Link key={guide.id} to={`/huong-dan/${guide.slug}`} className="group">
              <Card className="h-full border border-gray-100 hover:border-orange-200 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2rem] overflow-hidden bg-white">
                <div className="relative h-64 w-full overflow-hidden bg-gray-50">
                  {guide.image_url ? (
                    <img
                      src={guide.image_url}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-orange-200 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-orange-600/90 text-white backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-lg">
                      Cẩm Nang
                    </Badge>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {guide.published_at ? formatDate(guide.published_at) : 'Mới đây'}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight mb-4">
                    {guide.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">
                    {guide.excerpt ||
                      guide.meta_description ||
                      'Nhấn để xem chi tiết hướng dẫn và các bước thực hiện!'}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-orange-600 font-black text-xs uppercase group-hover:gap-4 transition-all">
                    Xem chi tiết →
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.total_pages}
          onPageChange={(p) => updateFilters({ page: p })}
        />
      )}

      {guides?.length === 0 && !isLoading && (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">
            Chưa có nội dung hướng dẫn nào
          </p>
        </div>
      )}
    </div>
  );
}
