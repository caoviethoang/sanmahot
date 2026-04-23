export function CardSkeleton({ type = 'coupon' }: { type?: 'coupon' | 'deal' }) {
  if (type === 'deal') {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="aspect-square bg-gray-100 animate-pulse" />
        <div className="p-5 space-y-3 flex-1">
          <div className="h-4 bg-gray-100 animate-pulse rounded-full w-3/4" />
          <div className="h-4 bg-gray-100 animate-pulse rounded-full w-1/2" />
          <div className="mt-auto pt-4 flex justify-between">
            <div className="h-6 bg-gray-100 animate-pulse rounded-full w-1/3" />
            <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-40 flex">
      <div className="w-[100px] sm:w-[120px] bg-gray-100 animate-pulse shrink-0" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 bg-gray-100 animate-pulse rounded-full w-3/4" />
        <div className="h-4 bg-gray-100 animate-pulse rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 animate-pulse rounded-full w-1/4 pt-2" />
        <div className="flex justify-end pt-2">
          <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({
  count = 6,
  type = 'coupon',
}: {
  count?: number;
  type?: 'coupon' | 'deal';
}) {
  const gridClasses =
    type === 'deal'
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 gap-6';

  return (
    <div className={gridClasses}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} type={type} />
      ))}
    </div>
  );
}
