import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { BrandHeader } from '../components/BrandHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import CouponCard from '../components/CouponCard';
import FilterSidebar from '../components/FilterSidebar';
import { Button } from '../components/ui/button';
import { ListSkeleton } from '../components/ui/LoadingSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { useCouponCategories, useCoupons } from '../hooks/useCoupons';
import { getBrandConfig } from '../lib/brand-config';
import { formatDate, formatPrice } from '../lib/utils';
import type { Coupon } from '../types';

export default function Coupons() {
  const [searchParams] = useSearchParams();
  const initialPlatform = searchParams.get('platform') || '';

  const [page, setPage] = useState(1);
  const [merchant, setMerchant] = useState(initialPlatform);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { data: categoriesData } = useCouponCategories();

  const { data, isLoading } = useCoupons({
    platform: merchant || undefined,
    category: category || undefined,
    sort: sort || undefined,
    page,
    per_page: 20,
  });

  const coupons = data?.coupons;
  const pagination = data?.pagination;

  const brand = getBrandConfig(merchant);

  const timeInfo = useMemo(() => {
    const now = new Date();
    return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  }, []);

  const headerDescription = useMemo(() => {
    return merchant
      ? `Mã giảm giá ${brand.name} mới nhất tháng ${timeInfo}, coupon ${brand.name} App để mua hàng trên ứng dụng, các deal khuyến mãi, ${brand.name} Flash Sale được cập nhật liên tục mỗi ngày.`
      : `Tổng hợp mã giảm giá từ Shopee, Lazada, Tiki... mới nhất tháng ${timeInfo}. Giúp bạn tiết kiệm tối đa khi mua sắm online.`;
  }, [merchant, brand.name, timeInfo]);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const allCategories = useMemo(() => {
    return Array.from(new Set([...(categoriesData || []), 'Freeship']));
  }, [categoriesData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Helmet>
        <title>
          {merchant
            ? `Mã giảm giá ${brand.name} hot nhất hôm nay | SanMaHot`
            : 'Mã giảm giá Shopee, Lazada, Tiki hot nhất hôm nay | SanMaHot'}
        </title>
        <meta
          name="description"
          content={`Tổng hợp mã giảm giá ${merchant ? brand.name : 'các sàn TMĐT'} mới nhất. Lấy mã ngay để nhận ưu đãi cực khủng khi mua sắm online.`}
        />
      </Helmet>

      <BrandHeader
        logo={<brand.Logo />}
        name={merchant ? brand.name : 'Các Sàn'}
        description={headerDescription}
        totalCount={pagination?.total_count}
        timeNow={timeInfo}
        accentColor={brand.color}
      />

      <CategoryTabs
        categories={allCategories}
        activeCategory={category}
        onCategoryChange={(cat) => handleFilterChange(() => setCategory(cat))}
      />

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
            onCategoryChange={(v) => handleFilterChange(() => setCategory(String(v)))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          {isLoading ? (
            <ListSkeleton count={6} />
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
              {coupons?.map((coupon: Coupon) => (
                <CouponCard
                  key={coupon.id}
                  id={coupon.id}
                  platform={coupon.platform?.toLowerCase()}
                  title={coupon.title}
                  description={coupon.description}
                  category={coupon.category}
                  terms={coupon.terms}
                  targetUsers={coupon.target_users}
                  minSpend={
                    coupon.min_order_value ? formatPrice(coupon.min_order_value) : undefined
                  }
                  code={coupon.code}
                  expiryText={formatDate(coupon.end_at)}
                />
              ))}
            </div>
          )}

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
            />
          )}
        </div>

        <aside className="hidden lg:block lg:col-span-4 sticky top-24 self-start">
          <FilterSidebar
            type="coupons"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(String(v)))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </aside>
      </div>
    </div>
  );
}
