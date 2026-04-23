import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  accentColor?: 'orange' | 'red' | 'blue' | 'sky';
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  accentColor = 'orange',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const colorClasses = {
    orange: 'border-orange-200 hover:bg-orange-50 text-orange-600 bg-orange-50',
    red: 'border-red-200 hover:bg-red-50 text-red-600 bg-red-50',
    blue: 'border-blue-200 hover:bg-blue-50 text-blue-600 bg-blue-50',
    sky: 'border-sky-200 hover:bg-sky-50 text-sky-600 bg-sky-50',
  };

  const btnClasses = colorClasses[accentColor].split(' ').slice(0, 3).join(' '); // border, hover, text
  const currentClasses = colorClasses[accentColor].split(' ').slice(2, 4).join(' '); // text, bg

  return (
    <div className="flex justify-center items-center gap-4 mt-12 pb-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={btnClasses}
      >
        Trang trước
      </Button>

      <div
        className={`text-sm font-medium px-4 py-2 rounded-full border ${currentClasses} border-opacity-20`}
      >
        Trang <span className="font-bold">{currentPage}</span> / {totalPages}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={btnClasses}
      >
        Trang sau
      </Button>
    </div>
  );
}
