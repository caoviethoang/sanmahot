import { useArticles } from '../hooks/useArticles';
import { Article } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen } from 'lucide-react';

import { useState } from 'react';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
};

export default function Guides() {
  const [page, setPage] = useState(1);
  const [platform, setPlatform] = useState<string | null>(null);

  const { data, isLoading } = useArticles({
    page,
    per_page: 12,
    category: 'Hướng Dẫn',
    ...(platform && { platform } as any), // platform isn't in original params but backend seems to support it?
  });

  const guides = data?.articles;
  const pagination = data?.pagination;

  const handlePlatformChange = (newPlatform: string | null) => {
    setPlatform(newPlatform);
    setPage(1);
  };

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
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Hướng Dẫn Mua Sắm
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Kinh nghiệm săn mã giảm giá, cách sử dụng voucher và các thủ thuật mua hàng tiết kiệm
          nhất.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={platform === null ? 'default' : 'outline'}
            onClick={() => handlePlatformChange(null)}
            className={
              platform === null
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'border-orange-200 text-orange-700'
            }
          >
            Tất cả
          </Button>
          <Button
            variant={platform === 'shopee' ? 'default' : 'outline'}
            onClick={() => handlePlatformChange('shopee')}
            className={
              platform === 'shopee'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'border-orange-200 text-orange-700'
            }
          >
            Shopee
          </Button>
          <Button
            variant={platform === 'lazada' ? 'default' : 'outline'}
            onClick={() => handlePlatformChange('lazada')}
            className={
              platform === 'lazada'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'border-orange-200 text-orange-700'
            }
          >
            Lazada
          </Button>
          <Button
            variant={platform === 'tiki' ? 'default' : 'outline'}
            onClick={() => handlePlatformChange('tiki')}
            className={
              platform === 'tiki'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'border-orange-200 text-orange-700'
            }
          >
            Tiki
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides?.map((guide: Article) => (
          <Link key={guide.id} to={`/huong-dan/${guide.slug}`}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                {guide.image_url ? (
                  <img
                    src={guide.image_url}
                    alt={guide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1454165833756-96b6f2d1cb7d?q=80&w=2070&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-orange-300 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-orange-600/90 text-white backdrop-blur-sm border-none shadow-lg">
                    Cẩm Nang
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3 border-b bg-muted/5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3 mr-1 text-orange-500" />
                  {guide.published_at ? formatDate(guide.published_at) : 'Mới đây'}
                </div>
                <CardTitle className="text-xl group-hover:text-orange-600 transition-colors line-clamp-2">
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {guide.excerpt ||
                    guide.meta_description ||
                    'Nhấn để xem chi tiết hướng dẫn và các bước thực hiện!'}
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
            className="border-orange-200 hover:bg-orange-50 text-orange-700"
          >
            Trang trước
          </Button>
          <div className="text-sm font-medium text-muted-foreground bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
            Trang <span className="text-orange-700">{page}</span> / {pagination.total_pages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p: number) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="border-orange-200 hover:bg-orange-50 text-orange-700"
          >
            Trang sau
          </Button>
        </div>
      )}

      {guides?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Chưa có nội dung hướng dẫn nào được đăng tải.
        </div>
      )}
    </div>
  );
}
