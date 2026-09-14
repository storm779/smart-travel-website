interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />;
}

export function PackageCardSkeleton() {
  return (
    <div className="h-[500px] rounded-3xl overflow-hidden bg-white shadow-xl">
      <div className="bg-gray-200 animate-pulse h-[60%]" />
      <div className="p-6 space-y-3">
        <div className="bg-gray-200 animate-pulse h-6 w-3/4 rounded-lg" />
        <div className="flex gap-4">
          <div className="bg-gray-200 animate-pulse h-4 w-20 rounded-lg" />
          <div className="bg-gray-200 animate-pulse h-4 w-16 rounded-lg" />
        </div>
        <div className="bg-gray-200 animate-pulse h-4 w-full rounded-lg" />
        <div className="bg-gray-200 animate-pulse h-4 w-2/3 rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="bg-gray-200 animate-pulse h-6 w-24 rounded-lg" />
          <div className="bg-gray-200 animate-pulse h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ItineraryCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
      <div className="bg-gray-200 animate-pulse h-64" />
      <div className="p-6 space-y-4">
        <div className="bg-gray-100 animate-pulse h-20 rounded-xl" />
        <div className="space-y-2">
          <div className="bg-gray-200 animate-pulse h-4 w-32 rounded-lg" />
          <div className="bg-gray-200 animate-pulse h-3 w-full rounded-lg" />
          <div className="bg-gray-200 animate-pulse h-3 w-3/4 rounded-lg" />
          <div className="bg-gray-200 animate-pulse h-3 w-1/2 rounded-lg" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="bg-gray-200 animate-pulse h-12 w-full rounded-xl" />
          <div className="bg-gray-200 animate-pulse h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="flex">
        <div className="bg-gray-200 animate-pulse w-48 h-40" />
        <div className="flex-1 p-5 space-y-3">
          <div className="bg-gray-200 animate-pulse h-5 w-3/4 rounded-lg" />
          <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded-lg" />
          <div className="flex gap-3">
            <div className="bg-gray-200 animate-pulse h-4 w-24 rounded-lg" />
            <div className="bg-gray-200 animate-pulse h-4 w-20 rounded-lg" />
          </div>
          <div className="bg-gray-200 animate-pulse h-6 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
