import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DealCard from '../components/DealCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: deals, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return [];
      const response = await api.get('/search', { params: { 'q[title_or_description_cont]': query } });
      return response.data;
    },
    enabled: !!query,
  });

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
    </div>
  );
}
