import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DealCard from '../components/DealCard';
import FilterSidebar from '../components/FilterSidebar';
import { Button } from '../components/ui/button';
import { ListSkeleton } from '../components/ui/LoadingSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { useDeals } from '../hooks/useDeals';
import type { Deal } from '../types';

export default function Deals() {
  const [page, setPage] = useState(1);
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<number | ''>('');
  const [sort, setSort] = useState('newest');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { data, isLoading } = useDeals({
    platform: merchant || undefined,
    category_id: category || undefined,
    sort: sort || undefined,
    page,
    per_page: 20,
  });

  const deals = data?.deals;
  const pagination = data?.pagination;

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Helmet>
        <title>Deal Ngon - Khuyến mãi cực hot hôm nay | SanMaHot</title>
        <meta
          name="description"
          content="Săn deal hot, giảm giá sốc từ các sàn Thương mại điện tử. Cập nhật liên tục 24/7."
        />
      </Helmet>

      <div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 uppercase">
          DEAL NGON <span className="text-red-600 block sm:inline">HÔM NAY</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg max-w-2xl">
          Tổng hợp những sản phẩm đang giảm giá sâu nhất từ Shopee, Lazada, Tiki... giúp bạn mua sắm
          thông minh và tiết kiệm.
        </p>
      </div>

      <div className="lg:hidden flex justify-end">
        <Button
          variant="outline"
          className="rounded-full hover:bg-red-50 hover:text-red-600 border-red-200 transition-colors"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Bộ lọc {(merchant || category || sort !== 'newest') && '•'}
        </Button>
      </div>

      {showMobileFilter && (
        <div className="lg:hidden">
          <FilterSidebar
            type="deals"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(Number(v)))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          {isLoading ? (
            <ListSkeleton count={8} type="deal" />
          ) : deals?.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-bold text-lg">Không tìm thấy deal nào phù hợp</p>
              <Button
                variant="outline"
                className="mt-6 border-red-200 text-red-600 hover:bg-red-50"
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {deals?.map((deal: Deal) => (
                <DealCard key={deal.id} deal={deal} />
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
            type="deals"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(Number(v)))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </aside>
      </div>
    </div>
  );
}
