import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DealCard from '../components/DealCard';
import CouponCard from '../components/CouponCard';
import { Button } from '../components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [activeTab, setActiveTab] = useState<'deals' | 'coupons'>('deals');
  const [page, setPage] = useState(1);

  const { data: dealsData, isLoading: dealsLoading } = useQuery({
    queryKey: ['search-deals', query, page],
    queryFn: async () => {
      if (!query) return null;
      const response = await api.get('/deals', {
        params: { q: query, page, per_page: 12 },
      });
      return response.data;
    },
    enabled: !!query,
  });

  const { data: couponsData, isLoading: couponsLoading } = useQuery({
    queryKey: ['search-coupons', query, page],
    queryFn: async () => {
      if (!query) return null;
      const response = await api.get('/coupons', {
        params: { q: query, page, per_page: 12 },
      });
      return response.data;
    },
    enabled: !!query,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {query ? `Kết quả cho: "${query}"` : 'Tìm kiếm'}
        </h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tìm deal, mã giảm giá, thương hiệu..."
              className="flex-1 ml-3 bg-transparent outline-none text-gray-700 font-medium"
            />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 font-bold">
            Tìm kiếm
          </Button>
        </form>
      </div>

      {query && (
        <>
          {/* Tab Switcher */}
          <div className="flex gap-2 border-b border-gray-100 pb-1">
            <button
              onClick={() => { setActiveTab('deals'); setPage(1); }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'deals'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Deal {dealsPagination?.total_count !== undefined && `(${dealsPagination.total_count})`}
            </button>
            <button
              onClick={() => { setActiveTab('coupons'); setPage(1); }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'coupons'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Mã giảm giá {couponsPagination?.total_count !== undefined && `(${couponsPagination.total_count})`}
            </button>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : activeTab === 'deals' ? (
            <>
              {!deals?.length ? (
                <p className="text-center py-16 text-gray-400 font-medium">
                  Không tìm thấy deal nào cho "{query}"
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {deals.map((deal: any) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {!coupons?.length ? (
                <p className="text-center py-16 text-gray-400 font-medium">
                  Không tìm thấy mã giảm giá nào cho "{query}"
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coupons.map((coupon: any) => (
                    <CouponCard
                      key={coupon.id}
                      id={coupon.id}
                      platform={coupon.platform?.toLowerCase() || 'shopee'}
                      title={coupon.title}
                      description={coupon.description}
                      code={coupon.code}
                      minSpend={coupon.min_order_value ? formatPrice(parseFloat(coupon.min_order_value)) : undefined}
                      expiryText={coupon.end_at ? new Date(coupon.end_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '30/04'}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pb-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Trang trước
              </Button>
              <span className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                Trang <span className="text-gray-900 font-bold">{page}</span> / {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                disabled={page === pagination.total_pages}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Trang sau
              </Button>
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-6">🔍</p>
          <p className="text-xl font-bold text-gray-500">Nhập từ khóa để tìm kiếm</p>
          <p className="text-sm mt-2">Tìm deal, mã giảm giá, thương hiệu...</p>
        </div>
      )}
    </div>
  );
}
