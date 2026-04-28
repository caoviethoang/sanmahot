import { CheckCircle2, Info, X } from 'lucide-react';
import type { BrandConfig } from '../lib/brand-config';
import { Button } from './ui/button';

interface CouponCardDetailProps {
  brand: BrandConfig;
  title: string;
  code: string;
  expiryText: string;
  minSpend?: string | null;
  targetUsers?: string | null;
  terms?: string | null;
  description?: string | null;
  onClose: () => void;
  onCopyAndGo: (e: React.MouseEvent) => void;
}

export default function CouponCardDetail({
  brand,
  title,
  code,
  expiryText,
  minSpend,
  targetUsers,
  terms,
  description,
  onClose,
  onCopyAndGo,
}: CouponCardDetailProps) {
  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-8 ${brand.bg} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="bg-white rounded-3xl shadow-xl w-24 h-24 flex items-center justify-center overflow-hidden border-4 border-white/20 p-2">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-contain scale-[1.25] mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.src = '/logos/shopee.jpg';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-white/80 font-black uppercase tracking-widest text-xs">
                {brand.name}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{title}</h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl ${brand.lightBg} border border-gray-100`}>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                MÃ GIẢM GIÁ
              </div>
              <div className={`text-xl font-black ${brand.color} tracking-widest uppercase`}>
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
            onClick={onCopyAndGo}
          >
            COPY MÃ VÀ ĐẾN SHOP
          </Button>
        </div>
      </div>
    </div>
  );
}
