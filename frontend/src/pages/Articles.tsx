import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
};

export default function Articles() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['public_articles', page],
    queryFn: async () => {
      const response = await api.get(`/articles?page=${page}&per_page=12`);
      return response.data;
    },
  });

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
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Tin Khuyến Mãi
        </h1>
        <p className="text-muted-foreground text-lg">
          Cập nhật nhanh nhất các chương trình sale, mã giảm giá và kinh nghiệm mua sắm từ SanMaHot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((article: any) => (
          <Link key={article.id} to={`/tin-khuyen-mai/${article.slug}`}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
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
                  <Badge className="bg-purple-600/90 text-white backdrop-blur-sm border-none shadow-lg">
                    {article.category || 'Cập nhật'}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3 border-b bg-muted/5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3 mr-1 text-purple-500" />
                  {article.published_at ? formatDate(article.published_at) : 'Mới đây'}
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {article.excerpt ||
                    article.meta_description ||
                    'Nhấn để xem chi tiết bài đăng và các ưu đãi mới nhất!'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pb-8">
          <Button
            variant="outline"
            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
          >
            Trang trước
          </Button>
          <div className="text-sm font-medium text-muted-foreground bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
            Trang <span className="text-purple-700">{page}</span> / {pagination.total_pages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p: number) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
          >
            Trang sau
          </Button>
        </div>
      )}

      {articles?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Chưa có tin khuyến mãi nào được đăng tải.
        </div>
      )}
    </div>
  );
}
