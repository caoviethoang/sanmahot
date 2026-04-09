import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import DealCard from '../components/DealCard';
import { Button } from '../components/ui/button';
import { Filter } from 'lucide-react';

export default function Deals() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['deals', page],
    queryFn: async () => {
      const response = await api.get(`/deals?page=${page}&per_page=12`);
      return response.data;
    },
  });

  const deals = data?.deals;
  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Deal Ngon hôm nay - Tổng hợp khuyến mãi cực sốc | SanMaHot</title>
        <meta
          name="description"
          content="Danh sách deal ngon, giảm giá sốc từ Shopee, Lazada, Tiki. Đừng bỏ lỡ cơ hội mua hàng giá rẻ nhất."
        />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">Tất cả Deal Ngon</h1>
          <p className="text-muted-foreground">Tổng hợp deal hot từ các sàn TMĐT hôm nay.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" /> Lọc
          </Button>
          <select className="bg-background border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
            <option>Mới nhất</option>
            <option>Giá thấp nhất</option>
            <option>Giảm nhiều nhất</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {deals?.map((deal: any) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pb-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-red-200 hover:bg-red-50 text-red-600"
          >
            Trang trước
          </Button>
          <div className="text-sm font-medium text-muted-foreground bg-red-50 px-4 py-2 rounded-full border border-red-100">
            Trang <span className="text-red-600">{page}</span> / {pagination.total_pages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="border-red-200 hover:bg-red-50 text-red-600"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
