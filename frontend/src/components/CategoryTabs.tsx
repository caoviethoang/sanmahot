import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  showAll?: boolean;
  sort?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  showAll = true,
}: CategoryTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (dir: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/tabs flex items-center bg-white px-2 py-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <button
        onClick={() => scrollTabs('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-100 rounded-full opacity-0 translate-x-2 group-hover/tabs:translate-x-0 group-hover/tabs:opacity-100 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={tabsRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-14 scroll-smooth w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showAll && (
          <button
            onClick={() => onCategoryChange('')}
            className={`relative flex items-center justify-center whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0 cursor-pointer border ${
              !activeCategory
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] border-transparent'
                : 'text-gray-600 bg-white border-gray-200 hover:border-orange-400 hover:text-orange-600'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Gift className="w-4 h-4" /> Tất cả
            </span>
          </button>
        )}

        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(isActive ? '' : cat)}
              className={`relative flex items-center justify-center whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] border-transparent'
                  : 'text-gray-600 bg-white border-gray-200 hover:border-orange-400 hover:text-orange-600'
              }`}
            >
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scrollTabs('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-100 rounded-full opacity-0 -translate-x-2 group-hover/tabs:translate-x-0 group-hover/tabs:opacity-100 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
