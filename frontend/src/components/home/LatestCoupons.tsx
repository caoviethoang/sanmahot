import { Link } from 'react-router-dom';
import CouponCard from '../CouponCard';
import { ListSkeleton } from '../ui/LoadingSkeleton';
import { formatPrice } from '../../lib/utils';

interface LatestCouponsProps {
  coupons: any[];
  isLoading: boolean;
}

export default function LatestCoupons({ coupons, isLoading }: LatestCouponsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-0">
      <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2 text-primary">
            MÃ KHUYẾN MÃI MỚI NHẤT
          </h2>
          <p className="text-gray-500 font-medium italic">
            Vừa cập nhật từ các sàn thương mại điện tử
          </p>
        </div>
        <Link
          to="/coupons"
          className="text-sm font-black text-primary hover:opacity-80 transition-opacity hidden md:block"
        >
          TẤT CẢ MÃ GIẢM GIÁ →
        </Link>
      </div>

      {isLoading ? (
        <ListSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coupons?.map((coupon: any) => (
            <CouponCard
              title={coupon.title}
              key={coupon.id}
              id={coupon.id}
              platform={coupon.platform?.toLowerCase()}
              description={coupon.description || coupon.title}
              minSpend={coupon.min_order_value ? formatPrice(coupon.min_order_value) : undefined}
              code={coupon.code}
              expiryText={
                coupon.end_at
                  ? new Date(coupon.end_at).toLocaleDateString('vi-VN')
                  : 'Hết hạn sau'
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
