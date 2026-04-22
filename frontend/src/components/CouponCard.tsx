import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getBrandConfig } from '../lib/brand-config';
import CouponCardDetail from './CouponCardDetail';

interface CouponProps {
  id: number;
  platform: string;
  title: string;
  description?: string;
  category?: string;
  terms?: string;
  targetUsers?: string;
  minSpend?: string;
  code: string;
  expiryText: string;
}

export default function CouponCard({
  id,
  platform,
  title,
  description,
  category,
  terms,
  targetUsers,
  minSpend,
  code,
  expiryText,
}: CouponProps) {
  const [showDetail, setShowDetail] = useState(false);
  const brand = getBrandConfig(platform);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDetail) {
        setShowDetail(false);
      }
    };
    if (showDetail) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDetail]);

  const handleOnlyCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);

    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300';
    toast.innerText = 'Đã copy mã';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const handleCopyCodeAndGo = (e: React.MouseEvent) => {
    handleOnlyCopyCode(e);
    // Open affiliate link in new tab
    window.open(`/api/go/coupon/${id}`, '_blank');
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="relative flex bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group w-full cursor-pointer overflow-visible min-h-[160px]"
      >
        {/* Left Section (Colored Ticket Band) */}
        <div
          className={`relative flex flex-col items-center justify-center p-3 sm:p-4 ${brand.bg} w-[90px] sm:w-[110px] shrink-0 rounded-l-2xl border-r border-dashed border-white/30`}
        >
          <div className="bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10 flex items-center justify-center w-14 h-14 overflow-hidden border border-gray-100 p-2">
            <img
              src={brand.image}
              alt={platform}
              className="w-full h-full object-contain scale-[1.3] mix-blend-multiply"
              onError={(e) => {
                e.currentTarget.src = '/logos/shopee.jpg';
              }}
            />
          </div>
          <div className="mt-3 text-[12px] font-black uppercase tracking-tight text-white text-center leading-tight">
            {category || 'Ưu đãi'}
          </div>
          <div className="font-bold mt-auto text-white/90 flex flex-col items-center">
            <span className="opacity-70 uppercase text-[12px]">HSD</span>
            <span className="font-black tracking-tighter">{expiryText}</span>
          </div>
        </div>

        {/* Main Content (Right Side) */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0 bg-white rounded-r-2xl">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-black text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 text-sm">
                {title}
              </h3>
            </div>
            <div className="text-[12px] font-bold text-gray-700 truncate">
              {minSpend ? `ĐH tối thiểu: ${minSpend}` : 'ĐH tối thiểu: 0đ'}
            </div>
            {targetUsers && (
              <div className="text-[11px] text-gray-500 font-bold flex flex-wrap items-center gap-1 line-clamp-2 leading-tight">
                Đối tượng: <span className="text-gray-700">{targetUsers}</span>
              </div>
            )}
            <div className="text-[12px] text-orange-600 font-bold italic opacity-90 underline decoration-orange-200 cursor-pointer hover:text-orange-700 pt-1">
              Xem chi tiết
            </div>
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-black px-4 h-9 text-xs rounded-xl active:scale-95 transition-transform shadow-md w-full sm:w-auto"
              onClick={handleOnlyCopyCode}
            >
              Copy mã
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <CouponCardDetail
          brand={brand}
          title={title}
          code={code}
          expiryText={expiryText}
          minSpend={minSpend}
          targetUsers={targetUsers}
          terms={terms}
          description={description}
          onClose={() => setShowDetail(false)}
          onCopyAndGo={handleCopyCodeAndGo}
        />
      )}
    </>
  );
}
