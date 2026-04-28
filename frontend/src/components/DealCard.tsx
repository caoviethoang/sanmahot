import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

import type { Deal } from '../types';

interface DealProps {
  deal: Deal;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

const formatTimeRemaining = (dateString: string | null) => {
  if (!dateString) return null;
  const now = new Date();
  const end = new Date(dateString);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Đã hết hạn';
  if (diffDays === 0) return 'Hết hạn hôm nay';
  return `Còn ${diffDays} ngày`;
};

export default function DealCard({ deal }: DealProps) {
  return (
    <a
      href={`/api/go/deal/${deal.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full group"
    >
      <Card className="overflow-hidden border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer h-full flex flex-col bg-white rounded-3xl relative">
        <div className="relative aspect-square overflow-hidden bg-white p-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {deal.image_url ? (
            <img
              src={deal.image_url}
              alt={deal.title}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out relative z-10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center relative z-10">
              <span className="text-gray-300 text-xs font-black uppercase tracking-tighter">
                No Image
              </span>
            </div>
          )}

          {deal.discount_percent && (
            <div className="absolute top-4 right-4 gradient-hot text-white font-black text-[12px] px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/30 z-20 animate-in zoom-in duration-500">
              -{Math.round(deal.discount_percent)}%
            </div>
          )}

          {deal.expired_at && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold text-[10px] px-2 py-1 rounded-lg border border-gray-100 z-20">
              {formatTimeRemaining(deal.expired_at)}
            </div>
          )}
        </div>

        <CardContent className="p-5 md:p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/20">
          <h3 className="font-extrabold text-[15px] leading-snug text-gray-800 line-clamp-2 mb-4 group-hover:text-primary transition-colors duration-300">
            {deal.title}
          </h3>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            {deal.sale_price ? (
              <div className="flex flex-col">
                <span className="text-xl font-black text-red-600 tracking-tighter">
                  {formatPrice(deal.sale_price)}
                </span>
                {deal.original_price && deal.original_price > deal.sale_price && (
                  <span className="text-xs font-bold text-gray-400 line-through">
                    {formatPrice(deal.original_price)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-lg font-black text-gray-900 tracking-tighter">
                {deal.original_price ? formatPrice(deal.original_price) : 'Liên hệ'}
              </span>
            )}

            <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
