import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import DealCard from '../components/DealCard';
import FilterSidebar from '../components/FilterSidebar';
import { Button } from '../components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Pagination } from '../components/ui/Pagination';
import { ListSkeleton } from '../components/ui/LoadingSkeleton';

export default function Deals() {
  const [page, setPage] = useState(1);
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1); // Reset to page 1 when filters change
  };

  const { data, isLoading } = useQuery({
    queryKey: ['deals', page, merchant, category, sort],
    queryFn: async () => {
      const response = await api.get('/deals', {
        params: {
          page,
          per_page: 12,
          ...(merchant && { merchant }),
          ...(category && { category }),
          ...(sort && { sort }),
        },
      });
      return response.data;
    },
  });

  const deals = data?.deals;
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Deal Ngon hôm nay - Tổng hợp khuyến mãi cực sốc | SanMaHot</title>
        <meta
          name="description"
          content="Danh sách deal ngon, giảm giá sốc từ Shopee, Lazada, Tiki. Đừng bỏ lỡ cơ hội mua hàng giá rẻ nhất."
        />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600 uppercase">
            Tất cả Deal Ngon
          </h1>
          <p className="text-muted-foreground font-medium">
            Tổng hợp deal hot từ các sàn TMĐT hôm nay.
            {pagination && (
              <span className="ml-2 font-bold text-red-500">({pagination.total_count} deal)</span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          className="lg:hidden rounded-full hover:bg-red-50 hover:text-red-600 border-red-200 transition-colors"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Bộ lọc {(merchant || category || sort) && '•'}
        </Button>
      </div>

      {/* Mobile filter panel */}
      {showMobileFilter && (
        <div className="lg:hidden bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <FilterSidebar
            type="deals"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(v))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
          <FilterSidebar
            type="deals"
            merchant={merchant}
            category={category}
            sort={sort}
            onMerchantChange={(v) => handleFilterChange(() => setMerchant(v))}
            onCategoryChange={(v) => handleFilterChange(() => setCategory(v))}
            onSortChange={(v) => handleFilterChange(() => setSort(v))}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <ListSkeleton count={12} type="deal" />
          ) : deals?.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-bold text-lg">Không tìm thấy deal nào phù hợp</p>
              <p className="text-sm mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
              <Button
                variant="outline"
                className="mt-6 border-red-200 text-red-600 hover:bg-red-50 font-bold px-8 py-6 rounded-2xl"
                onClick={() => {
                  setMerchant('');
                  setCategory('');
                  setSort('');
                  setPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {deals?.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
              accentColor="red"
            />
          )}
        </div>
      </div>
    </div>
  );
}
