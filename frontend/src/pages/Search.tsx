import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DealCard from '../components/DealCard';
import { Button } from '../components/ui/button';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: async () => {
      if (!query) return null;
      const response = await api.get('/search', {
        params: { 'q[title_or_description_cont]': query, page, per_page: 12 },
      });
      return response.data;
    },
    enabled: !!query,
  });

  const deals = data?.deals;
  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kết quả tìm kiếm cho: "{query}"</h1>
        <p className="text-muted-foreground">Tìm kiếm deal liên quan đến từ khóa của bạn.</p>
      </div>

      {!query ? (
        <p>Vui lòng nhập từ khóa để tìm kiếm.</p>
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {deals?.map((deal: any) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          {deals?.length === 0 && <p className="col-span-full">Không tìm thấy deal nào phù hợp.</p>}
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pb-8">
          <Button
            variant="outline"
            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Trang trước
          </Button>
          <div className="text-sm font-medium text-muted-foreground bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            Trang <span className="text-gray-900">{page}</span> / {pagination.total_pages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p: number) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
