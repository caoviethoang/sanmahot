import type { ReactNode } from 'react';

interface BrandHeaderProps {
  logo: ReactNode;
  name: string;
  description: string;
  totalCount?: number;
  timeNow?: string;
  accentColor?: string;
}

export function BrandHeader({
  logo,
  name,
  description,
  totalCount,
  timeNow,
  accentColor = 'text-orange-500',
}: BrandHeaderProps) {
  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="w-48 h-48 flex items-center justify-center p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
        <div className="w-full h-full flex items-center justify-center">{logo}</div>
      </div>
      <div className="flex-1 space-y-4 text-center md:text-left">
        <h1 className={`text-3xl md:text-5xl font-black ${accentColor} tracking-tight`}>
          Mã Giảm Giá {name} {timeNow && `Tháng ${timeNow}`}
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed max-w-3xl italic text-lg">
          {description}
        </p>
        {totalCount !== undefined && (
          <p className={`text-sm font-bold ${accentColor}`}>
            {totalCount} mã giảm giá đang hoạt động
          </p>
        )}
      </div>
    </section>
  );
}
