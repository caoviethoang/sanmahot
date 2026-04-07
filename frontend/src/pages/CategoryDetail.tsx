import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import DealCard from '../components/DealCard';

export default function CategoryDetail() {
  const { slug } = useParams();
  
  const { data: category, isLoading: isCatLoading } = useQuery({
    queryKey: ['categories', slug],
    queryFn: async () => {
      const response = await api.get(`/categories/${slug}`);
      return response.data;
    },
  });

  const { data: deals, isLoading: isDealsLoading } = useQuery({
    queryKey: ['categories', slug, 'deals'],
    queryFn: async () => {
      const response = await api.get(`/categories/${slug}/deals`);
      return response.data;
    },
    enabled: !!category,
  });

  if (isCatLoading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 bg-muted rounded"></div><div className="h-4 w-full bg-muted rounded"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{category?.name}</h1>
        <p className="text-muted-foreground">{category?.description}</p>
      </div>

      {isDealsLoading ? (
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
          {deals?.length === 0 && <p>Chưa có deal nào trong danh mục này.</p>}
        </div>
      )}
    </div>
  );
}
