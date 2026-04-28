import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CouponCard from '../components/CouponCard';
import DealCard from '../components/DealCard';
import { Button } from '../components/ui/button';
import { ListSkeleton } from '../components/ui/LoadingSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { useCoupons } from '../hooks/useCoupons';
import { useDeals } from '../hooks/useDeals';
import { formatDate, formatPrice } from '../lib/utils';
import type { Coupon, Deal } from '../types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [activeTab, setActiveTab] = useState<'deals' | 'coupons'>('deals');
  const [page, setPage] = useState(1);

  const { data: dealsData, isLoading: dealsLoading } = useDeals({
    q: query || undefined,
    page,
    per_page: 12,
  });

  const { data: couponsData, isLoading: couponsLoading } = useCoupons({
    q: query || undefined,
    page,
    per_page: 12,
  });

  const deals = dealsData?.deals;
  const coupons = couponsData?.coupons;
  const dealsPagination = dealsData?.pagination;
  const couponsPagination = couponsData?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: inputValue });
    setPage(1);
  };

  const isLoading = activeTab === 'deals' ? dealsLoading : couponsLoading;
  const pagination = activeTab === 'deals' ? dealsPagination : couponsPagination;

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 text-gray-900 uppercase">
          {query ? `KẾT QUẢ CHO: "${query}"` : 'TÌM KIẾM'}
        </h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 flex items-center bg-white border border-gray-100 rounded-[2rem] px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100 transition-all duration-300">
            <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tìm deal, mã giảm giá, thương hiệu..."
              className="flex-1 ml-4 bg-transparent outline-none text-gray-700 font-bold placeholder:text-gray-300"
            />
          </div>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white rounded-[2rem] px-10 font-black text-lg h-16 shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95"
          >
            TÌM KIẾM
          </Button>
        </form>
      </div>

      {query && (
        <>
          {/* Tab Switcher */}
          <div className="flex gap-4 border-b border-gray-100 pb-4 animate-in fade-in duration-700">
            <button
              onClick={() => {
                setActiveTab('deals');
                setPage(1);
              }}
              className={`px-8 py-3 rounded-full font-black text-sm transition-all duration-300 ${
                activeTab === 'deals'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              DEAL{' '}
              {dealsPagination?.total_count !== undefined && `(${dealsPagination.total_count})`}
            </button>
            <button
              onClick={() => {
                setActiveTab('coupons');
                setPage(1);
              }}
              className={`px-8 py-3 rounded-full font-black text-sm transition-all duration-300 ${
                activeTab === 'coupons'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              MÃ GIẢM GIÁ{' '}
              {couponsPagination?.total_count !== undefined && `(${couponsPagination.total_count})`}
            </button>
          </div>

          {/* Results */}
          {isLoading ? (
            <ListSkeleton count={8} type={activeTab === 'deals' ? 'deal' : 'coupon'} />
          ) : activeTab === 'deals' ? (
            <>
              {!deals?.length ? (
                <div className="text-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500">
                  <p className="text-6xl mb-6">🔍</p>
                  <p className="font-black text-xl text-gray-400 uppercase tracking-tight">
                    Không tìm thấy deal nào cho "{query}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {deals.map((deal: Deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {!coupons?.length ? (
                <div className="text-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500">
                  <p className="text-6xl mb-6">🔍</p>
                  <p className="font-black text-xl text-gray-400 uppercase tracking-tight">
                    Không tìm thấy mã nào cho "{query}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coupons.map((coupon: Coupon) => (
                    <CouponCard
                      key={coupon.id}
                      id={coupon.id}
                      platform={coupon.platform?.toLowerCase()}
                      title={coupon.title}
                      description={coupon.description}
                      code={coupon.code}
                      minSpend={
                        coupon.min_order_value ? formatPrice(coupon.min_order_value) : undefined
                      }
                      expiryText={formatDate(coupon.end_at)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
              accentColor="red"
            />
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-32 text-gray-300 animate-in fade-in zoom-in duration-1000">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
            <SearchIcon className="w-12 h-12 text-gray-200" />
          </div>
          <p className="text-2xl font-black text-gray-400 uppercase tracking-tighter">
            Nhập từ khóa để tìm kiếm
          </p>
          <p className="text-sm mt-3 font-medium text-gray-400 italic">
            Tìm deal hời, mã giảm giá khủng, thương hiệu yêu thích...
          </p>
        </div>
      )}
    </div>
  );
}
