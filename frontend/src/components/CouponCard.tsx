import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Info, CheckCircle2 } from 'lucide-react';

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

  const getPlatformDetails = () => {
    const normalizedPlatform = platform?.toLowerCase();
    switch (normalizedPlatform) {
      case 'shopee':
        return {
          logo: '/logos/shopee.jpg',
          color: 'text-[#ee4d2d]',
          bg: 'bg-[#ee4d2d]',
          lightBg: 'bg-[#ee4d2d]/5',
          border: 'border-[#ee4d2d]/20',
        };
      case 'lazada':
        return {
          logo: '/logos/lazada.jpg',
          color: 'text-[#0f136d]',
          bg: 'bg-[#0f136d]',
          lightBg: 'bg-[#0f136d]/5',
          border: 'border-[#0f136d]/20',
        };
      case 'tiki':
        return {
          logo: '/logos/tiki.jpg',
          color: 'text-[#1a94ff]',
          bg: 'bg-[#1a94ff]',
          lightBg: 'bg-[#1a94ff]/5',
          border: 'border-[#1a94ff]/20',
        };
      default:
        return {
          logo: `/logos/${normalizedPlatform}.jpg`,
          color: 'text-primary',
          bg: 'bg-primary',
          lightBg: 'bg-primary/5',
          border: 'border-primary/20',
        };
    }
  };

  const { logo, color, bg, lightBg } = getPlatformDetails();

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

  const handleCopyCode = (e: React.MouseEvent) => {
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
          className={`relative flex flex-col items-center justify-center p-3 sm:p-4 ${bg} w-[90px] sm:w-[110px] shrink-0 rounded-l-2xl border-r border-dashed border-white/30`}
        >
          <div className="bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10 flex items-center justify-center w-14 h-14 overflow-hidden border border-gray-100 p-2">
            <img
              src={logo}
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

          {/* Notches (Ticket Cutouts) */}
          {/* <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-100 z-20"></div> */}
          {/* <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-100 z-20"></div> */}
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
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-8 ${bg} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <button
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="bg-white rounded-3xl shadow-xl w-24 h-24 flex items-center justify-center overflow-hidden border-4 border-white/20 p-2">
                  <img
                    src={logo}
                    alt={platform}
                    className="w-full h-full object-contain scale-[1.25] mix-blend-multiply"
                    onError={(e) => {
                      e.currentTarget.src = '/logos/shopee.jpg';
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-white/80 font-black uppercase tracking-widest text-xs">
                    {platform} • {category}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl ${lightBg} border border-gray-100`}>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                    MÃ GIẢM GIÁ
                  </div>
                  <div className={`text-xl font-black ${color} tracking-widest uppercase`}>
                    {code}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                    HẠN SỬ DỤNG
                  </div>
                  <div className="text-xl font-black text-gray-900">{expiryText}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-black text-gray-900 text-lg">
                  <Info className="w-5 h-5 text-blue-500" />
                  Điều kiện & Ghi chú
                </h4>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3 text-sm text-gray-600 leading-relaxed">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-bold text-gray-900">Đơn hàng tối thiểu:</span>{' '}
                      {minSpend || '0đ'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-bold text-gray-900">Đối tượng:</span>{' '}
                      {targetUsers || 'Tất cả khách hàng'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 mt-2">
                    <p className="whitespace-pre-wrap">
                      {terms || description || 'Áp dụng cho các sản phẩm trong danh mục tương ứng.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-0 flex gap-4">
              <Button
                className="flex-1 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-xl shadow-green-200"
                onClick={handleCopyCode}
              >
                COPY MÃ VÀ ĐẾN SHOP
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
