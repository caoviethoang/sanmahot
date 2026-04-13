import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import CouponCard from '../components/CouponCard';
import FilterSidebar from '../components/FilterSidebar';
import { ShopeeLogo, LazadaLogo, TikiLogo } from '../components/BrandLogos';
import { Button } from '../components/ui/button';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Gift } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function Coupons() {
  const [searchParams] = useSearchParams();
  const initialPlatform = searchParams.get('platform') || '';

  const [page, setPage] = useState(1);
  const [merchant, setMerchant] = useState(initialPlatform);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const { data: categoriesData } = useQuery({
    queryKey: ['coupon-categories'],
    queryFn: async () => {
      const response = await api.get('/coupons/categories');
      return response.data as string[];
    },
  });

  const scrollTabs = (dir: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['coupons', merchant, category, sort, page],
    queryFn: async () => {
      const response = await api.get('/coupons', {
        params: {
          platform: merchant || undefined,
          category: category || undefined,
          sort: sort || undefined,
          page,
          per_page: 20,
        },
      });
      return response.data;
    },
  });

  const coupons = data?.coupons;
  const pagination = data?.pagination;

  const getBrandDetails = () => {
    switch (merchant?.toLowerCase()) {
      case 'shopee':
        return { logo: <ShopeeLogo />, name: 'Shopee' };
      case 'lazada':
        return { logo: <LazadaLogo />, name: 'Lazada' };
      case 'tiki':
        return { logo: <TikiLogo />, name: 'Tiki' };
      default:
        return { logo: <ShopeeLogo />, name: 'Tất cả các sàn' };
    }
  };

  const { logo, name } = getBrandDetails();
  const now = new Date();
  const timeNow = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Helmet>
        <title>
          {merchant
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
            Mã giảm giá {name} mới nhất tháng {timeNow}, coupon {name} App để mua hàng trên ứng
            dụng, các deal khuyến mãi, {name} Flash Sale được cập nhật liên tục, mỗi ngày tại danh
            mục coupon bên dưới.
          </p>
          {pagination && (
            <p className="text-sm font-bold text-orange-500">
              {pagination.total_count} mã giảm giá đang hoạt động
            </p>
          )}
        </div>
      </section>

      {/* Horizontal Category Tab Bar */}
      <div className="relative group/tabs flex items-center bg-white px-2 py-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <button
          onClick={() => scrollTabs('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-100 rounded-full opacity-0 translate-x-2 group-hover/tabs:translate-x-0 group-hover/tabs:opacity-100 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={tabsRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-14 scroll-smooth w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Tất cả tab */}
          <button
            onClick={() =>
              handleFilterChange(() => {
                setCategory('');
                setSort('newest');
              })
            }
            className={`relative flex items-center justify-center whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0 cursor-pointer border ${
              !category && sort === 'newest'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] border-transparent'
                : 'text-gray-600 bg-white border-gray-200 hover:border-orange-400 hover:text-orange-600'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Gift className="w-4 h-4" /> Tất cả
            </span>
          </button>

          {/* Dynamic category tabs */}
          {Array.from(new Set([...(categoriesData || []), 'Freeship'])).map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleFilterChange(() => setCategory(isActive ? '' : cat))}
                className={`relative flex items-center justify-center whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] border-transparent'
                    : 'text-gray-600 bg-white border-gray-200 hover:border-orange-400 hover:text-orange-600'
                }`}
              >
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}

          <div className="w-px h-6 bg-gray-200 self-center mx-2 shrink-0 rounded-full"></div>

          {/* Sort Tabs */}
          {[{ id: 'expiring', label: 'Sắp hết hạn ⏳' }].map((sortItem) => {
            const isActive = sort === sortItem.id;
            return (
              <button
                key={sortItem.id}
                onClick={() => handleFilterChange(() => setSort(isActive ? 'newest' : sortItem.id))}
                className={`relative flex items-center justify-center whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] border-transparent'
                    : 'text-gray-600 bg-white border-gray-200 hover:border-orange-400 hover:text-orange-600'
                }`}
              >
                <span className="relative z-10">{sortItem.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollTabs('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-100 rounded-full opacity-0 -translate-x-2 group-hover/tabs:translate-x-0 group-hover/tabs:opacity-100 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="lg:hidden flex justify-end">
        <Button
          variant="outline"
          className="rounded-full hover:bg-orange-50 hover:text-orange-600 border-orange-200 transition-colors"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Bộ lọc {(merchant || category || sort !== 'newest') && '•'}
        </Button>
      </div>

      {showMobileFilter && (
        <div className="lg:hidden">
          <FilterSidebar
            type="coupons"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(v))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-44 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : coupons?.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-bold text-lg">Không tìm thấy mã giảm giá phù hợp</p>
              <Button
                variant="outline"
                className="mt-6 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => {
                  setMerchant('');
                  setCategory('');
                  setSort('newest');
                  setPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
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
                  minSpend={
                    coupon.min_order_value
                      ? formatPrice(parseFloat(coupon.min_order_value))
                      : undefined
                  }
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

          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 pb-8">
              <Button
                variant="outline"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-orange-200 hover:bg-orange-50 text-orange-600"
              >
                Trang trước
              </Button>
              <div className="text-sm font-medium text-muted-foreground bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                Trang <span className="text-orange-600">{page}</span> / {pagination.total_pages}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p: number) => Math.min(pagination.total_pages, p + 1))}
                disabled={page === pagination.total_pages}
                className="border-orange-200 hover:bg-orange-50 text-orange-600"
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 self-start">
          <FilterSidebar
            type="coupons"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(v))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </aside>
      </div>
    </div>
  );
}
