import { Button } from './ui/button';
import { Copy, ArrowUpRight } from 'lucide-react';
import { ShopeeIcon, LazadaIcon, TikiIcon } from './PlatformIcons';

interface CouponProps {
  id: number;
  platform: 'shopee' | 'lazada' | 'tiki';
  discountText: string;
  minSpend?: string;
  code: string;
  expiryText: string;
}

export default function CouponCard({ id, platform, discountText, minSpend, code, expiryText }: CouponProps) {
  const getPlatformDetails = () => {
    switch (platform) {
      case 'shopee': return { icon: <ShopeeIcon className="w-8 h-8" />, color: 'text-[#ee4d2d]', bg: 'bg-[#ee4d2d]/10', border: 'border-[#ee4d2d]/20', badge: 'bg-[#ee4d2d]' };
      case 'lazada': return { icon: <LazadaIcon className="w-8 h-8" />, color: 'text-[#0f136d]', bg: 'bg-[#0f136d]/10', border: 'border-[#0f136d]/20', badge: 'bg-[#0f136d]' };
      case 'tiki': return { icon: <TikiIcon className="w-8 h-8" />, color: 'text-[#1a94ff]', bg: 'bg-[#1a94ff]/10', border: 'border-[#1a94ff]/20', badge: 'bg-[#1a94ff]' };
      default: return { icon: null, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', badge: 'bg-primary' };
    }
  };

  const { icon, color, bg, border } = getPlatformDetails();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300';
    toast.innerText = '🚀 Đã copy mã: ' + code;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  return (
    <div className="relative flex bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 group hover:-translate-y-1.5 w-full overflow-hidden">
      
      {/* Left Section (Brand & Logo) */}
      <div className={`relative flex flex-col items-center justify-center p-6 ${bg} w-[100px] md:w-[130px] shrink-0 ticket-cutout`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10">
          {icon}
        </div>
        <div className={`mt-3 text-[10px] font-black uppercase tracking-widest ${color} opacity-60 relative z-10`}>
          {platform}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 md:p-7 flex flex-col justify-between min-w-0 bg-gradient-to-br from-white via-white to-gray-50/30">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-extrabold text-gray-900 text-lg md:text-xl leading-tight line-clamp-2 transition-colors group-hover:text-primary">
              {discountText}
            </h3>
            {minSpend && (
              <span className="shrink-0 text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase tracking-tight">
                Min {minSpend}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-[11px] font-bold text-gray-400 gap-2">
            <span className="w-2 h-2 rounded-full gradient-hot animate-pulse"></span>
            HSD: {expiryText}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-6 gap-4">
          {/* Voucher Code Display */}
          <div className={`flex-1 flex items-center justify-between border-2 border-dashed ${border} ${bg} rounded-2xl px-4 py-3 group/code cursor-pointer transition-all active:scale-[0.98] outline-none hover:border-primary/40`} onClick={handleCopyCode}>
             <span className={`font-mono text-base md:text-lg font-black uppercase tracking-widest ${color} truncate`}>
               {code}
             </span>
             <Copy className={`w-4 h-4 ml-3 ${color} opacity-40 group-hover/code:opacity-100 transition-opacity`} />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
             <Button 
               size="lg" 
               className="gradient-hot text-white font-extrabold px-6 h-12 shadow-lg shadow-red-500/20 rounded-2xl flex-1 sm:flex-none active:scale-95 transition-transform"
               onClick={handleCopyCode}
             >
                COPY MÃ
             </Button>
             <a 
               href={`/api/go/coupon/${id}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-red-50 hover:border-red-100 transition-all active:scale-95"
               title="Đến Shop"
             >
                <ArrowUpRight className="w-5 h-5" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
