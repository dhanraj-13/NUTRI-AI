interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, rounded = '8px', className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'rgba(255,255,255,0.04)',
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="80%" />
      <Skeleton height={14} width="40%" />
      <div className="flex gap-3 pt-2">
        <Skeleton height={32} width={80} rounded="10px" />
        <Skeleton height={32} width={80} rounded="10px" />
      </div>
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <Skeleton width={56} height={56} rounded="50%" />
      <div className="flex-1 space-y-2">
        <Skeleton height={14} width="50%" />
        <Skeleton height={24} width="70%" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
          <Skeleton width={40} height={40} rounded="10px" />
          <div className="flex-1 space-y-2">
            <Skeleton height={14} width="60%" />
            <Skeleton height={12} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
