import { BRANDS } from '../lib/brand-config';

interface FilterSidebarProps {
  type: 'deals' | 'coupons';
  merchant?: string;
  category?: string;
  sort?: string;
  onMerchantChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const DEAL_CATEGORIES = [
  'Điện tử',
  'Nhà cửa & Đời sống',
  'Thời trang',
  'Làm đẹp',
  'Ưu đãi',
  'Freeship',
];

const DEAL_SORTS = [
  { value: '', label: 'Mới nhất' },
  { value: 'discount', label: 'Giảm giá nhiều nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
];

const COUPON_SORTS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'expiring', label: 'Sắp hết hạn' },
];

export default function FilterSidebar({
  type,
  merchant,
  category,
  sort,
  onMerchantChange,
  onCategoryChange,
  onSortChange,
}: FilterSidebarProps) {
  const merchants = Object.values(BRANDS);
  const sorts = type === 'deals' ? DEAL_SORTS : COUPON_SORTS;

  return (
    <aside className="space-y-6">
      {/* Sàn thương mại */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-lg text-gray-700 uppercase tracking-widest mb-4">
          🏪 Sàn TMĐT
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onMerchantChange('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-lg font-semibold transition-all ${
              !merchant
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🌐 Tất cả sàn
          </button>
          {merchants.map(({ id, name, Logo }) => (
            <button
              key={id}
              onClick={() => onMerchantChange(merchant === id ? '' : id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-lg font-semibold transition-all ${
                merchant === id
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="w-14 h-14 shrink-0">
                <Logo />
              </span>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Sắp xếp */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-lg text-gray-700 uppercase tracking-widest mb-4">
          🔀 Sắp xếp theo
        </h3>
        <div className="space-y-2">
          {sorts.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onSortChange(value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-lg font-semibold transition-all ${
                sort === value
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh mục (chỉ hiển thị với deals) */}
      {type === 'deals' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-lg text-gray-700 uppercase tracking-widest mb-4">
            🏷️ Danh mục
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange('')}
              className={`w-full text-left px-3 py-2 rounded-xl text-lg font-semibold transition-all ${
                !category
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tất cả danh mục
            </button>
            {DEAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(category === cat ? '' : cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-lg font-semibold transition-all ${
                  category === cat
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
