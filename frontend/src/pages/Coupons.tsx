import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import CouponCard from '../components/CouponCard';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function Coupons() {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const response = await api.get('/coupons');
      return response.data;
    },
  });

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Mã giảm giá Shopee, Lazada, Tiki hot nhất hôm nay | SanMaHot</title>
        <meta
          name="description"
          content="Tổng hợp mã giảm giá Shopee, voucher Lazada, Tiki mới nhất. Lấy mã ngay để nhận ưu đãi cực khủng khi mua sắm online."
        />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-red-600">Mã Giảm Giá</h1>
        <p className="text-muted-foreground">
          Lấy mã giảm giá Shopee, Lazada, TikTok Shop mới nhất.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons?.map((coupon: any) => (
            <CouponCard
              key={coupon.id}
              id={coupon.id}
              platform={coupon.platform.toLowerCase() as any}
              discountText={coupon.title}
              minSpend={coupon.min_order_value ? formatPrice(coupon.min_order_value) : undefined}
              code={coupon.code}
              expiryText={
                coupon.end_at
                  ? `HSD: ${new Date(coupon.end_at).toLocaleDateString('vi-VN')}`
                  : 'Không hết hạn'
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
