import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import CouponCard from '../components/CouponCard';
import {
  ShopeeLogo,
  LazadaLogo,
  TikiLogo,
  SendoLogo,
  NguyenKimLogo,
  FahasaLogo,
  GrabLogo,
} from '../components/BrandLogos';
import { Timer } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

const SIDEBAR_BRANDS = [
  { id: 'lazada', name: 'Lazada', Logo: LazadaLogo },
  { id: 'shopee', name: 'Shopee', Logo: ShopeeLogo },
  { id: 'tiki', name: 'Tiki', Logo: TikiLogo },
  { id: 'sendo', name: 'Sendo.vn', Logo: SendoLogo },
  { id: 'nguyenkim', name: 'Nguyễn Kim', Logo: NguyenKimLogo },
  { id: 'fahasa', name: 'Fahasa', Logo: FahasaLogo },
  { id: 'grab', name: 'Grab', Logo: GrabLogo },
];

export default function Coupons() {
  const [searchParams] = useSearchParams();
  const platformFilter = searchParams.get('platform');

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons', platformFilter],
    queryFn: async () => {
      const response = await api.get('/coupons', {
        params: { platform: platformFilter },
      });
      return response.data;
    },
  });

  const getBrandDetails = () => {
    switch (platformFilter?.toLowerCase()) {
      case 'shopee':
        return { logo: <ShopeeLogo />, name: 'Shopee' };
      case 'lazada':
        return { logo: <LazadaLogo />, name: 'Lazada' };
      case 'tiki':
        return { logo: <TikiLogo />, name: 'Tiki' };
      default:
        return { logo: <TikiLogo />, name: 'Tất cả các sàn' };
    }
  };

  const { logo, name } = getBrandDetails();

  const now = new Date();
  const timeNow = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Helmet>
        <title>
          {platformFilter
            ? `Mã giảm giá ${name} hot nhất hôm nay | SanMaHot`
            : 'Mã giảm giá Shopee, Lazada, Tiki hot nhất hôm nay | SanMaHot'}
        </title>
        <meta
          name="description"
          content={`Tổng hợp mã giảm giá ${name} mới nhất. Lấy mã ngay để nhận ưu đãi cực khủng khi mua sắm online.`}
        />
      </Helmet>

      {/* Brand Header */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-48 h-48 flex items-center justify-center p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
          {logo}
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-orange-500 tracking-tight">
            Mã Giảm Giá {name} Tháng {timeNow}
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed max-w-3xl italic text-lg">
            Mã giảm giá {name} mới nhất tháng {timeNow}, coupon {name} App để mua hàng trên ứng dụng,
            các deal khuyến mãi, {name} Flash Sale được cập nhật liên tục, mỗi ngày tại danh mục
            coupon bên dưới.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content: Coupon Grid */}
        <div className="lg:col-span-8 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-44 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons?.map((coupon: any) => (
                <CouponCard
                  key={coupon.id}
                  id={coupon.id}
                  platform={coupon.platform?.toLowerCase() || 'shopee'}
                  title={coupon.title}
                  description={coupon.description}
                  category={coupon.category}
                  terms={coupon.terms}
                  targetUsers={coupon.target_users}
                  minSpend={coupon.min_order_value ? formatPrice(parseFloat(coupon.min_order_value)) : undefined}
                  code={coupon.code}
                  expiryText={
                    coupon.end_at
                      ? new Date(coupon.end_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })
                      : '30/04'
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Popular Brands */}
        <aside className="lg:col-span-4 space-y-6 sticky top-24 hidden lg:block">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              {SIDEBAR_BRANDS.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/coupons?platform=${brand.id}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-1 justify-center ${
                    platformFilter === brand.id
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-gray-50 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="w-40 h-40 shrink-0 flex items-center justify-center p-2 bg-white rounded-xl shadow-sm">
                    <brand.Logo />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
