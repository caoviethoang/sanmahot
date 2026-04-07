import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';

export default function DealDetail() {
  const { slug } = useParams();
  const { data: deal, isLoading } = useQuery({
    queryKey: ['deals', slug],
    queryFn: async () => {
      const response = await api.get(`/deals/${slug}`);
      return response.data;
    },
  });

  if (isLoading) return <div className="h-96 bg-muted animate-pulse rounded-xl" />;
  if (!deal) return <div>Deal không tồn tại.</div>;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square relative rounded-2xl overflow-hidden border bg-white">
          <img src={deal.image_url} alt={deal.title} className="object-contain w-full h-full" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                <span>{deal.merchant_name}</span>
                <span>•</span>
                <span>{deal.category_name}</span>
             </div>
             <h1 className="text-3xl font-extrabold leading-tight">{deal.title}</h1>
          </div>
          
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl">
            <div className="space-y-1">
              <span className="text-3xl font-bold text-red-600">{formatCurrency(deal.sale_price)}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground line-through">{formatCurrency(deal.original_price)}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{deal.discount_percent}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <Button size="lg" className="w-full h-14 text-lg font-bold rounded-full" asChild>
               <a href={`/api/go/deal/${deal.id}`} target="_blank" rel="noopener noreferrer">Đến Nơi Bán</a>
             </Button>
             <p className="text-center text-xs text-muted-foreground">Bạn sẽ được chuyển hướng đến {deal.merchant_name} qua link affiliate của chúng tôi.</p>
          </div>

          <div className="prose prose-sm max-w-none border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Chi tiết deal</h3>
            <p>{deal.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
