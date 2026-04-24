import { useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import { Article } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Pagination } from '../components/ui/Pagination';

export default function Articles() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useArticles({ page, per_page: 12 });

  const articles = data?.articles;
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent uppercase">
          Tin Khuyến Mãi
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Cập nhật nhanh nhất các chương trình sale, mã giảm giá và kinh nghiệm mua sắm từ SanMaHot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((article: Article) => (
          <Link key={article.id} to={`/tin-khuyen-mai/${article.slug}`}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group border-gray-100">
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <span className="text-purple-300 font-bold text-lg opacity-50">
                      SanMaHot News
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-purple-600/90 text-white backdrop-blur-sm border-none shadow-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    {article.category || 'Cập nhật'}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3 border-b bg-muted/5">
                <div className="flex items-center text-xs text-muted-foreground mb-2 font-bold">
                  <Calendar className="w-3 h-3 mr-1 text-purple-500" />
                  {article.published_at
                    ? formatDate(article.published_at, { month: 'long', year: 'numeric' })
                    : 'Mới đây'}
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2 font-extrabold uppercase">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                  {article.excerpt ||
                    article.meta_description ||
                    'Nhấn để xem chi tiết bài đăng và các ưu đãi mới nhất!'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.total_pages}
          onPageChange={setPage}
          accentColor="blue"
        />
      )}

      {articles?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Chưa có tin khuyến mãi nào được đăng tải.
        </div>
      )}
    </div>
  );
}
