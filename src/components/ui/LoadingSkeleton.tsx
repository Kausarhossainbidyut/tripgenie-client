import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingSkeletonProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
}

export function LoadingSkeleton({ count = 1, height = 20, width, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={className}>
      <Skeleton
        count={count}
        height={typeof height === 'string' ? height : undefined}
        width={typeof width === 'string' ? width : undefined}
        style={{
          ...(typeof height === 'number' ? { height } : {}),
          ...(typeof width === 'number' ? { width } : {}),
        }}
        duration={1.2}
      />
    </div>
  );
}

// Card skeleton for common loading patterns
export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <LoadingSkeleton height={200} className="mb-4" />
      <LoadingSkeleton height={24} count={2} className="mb-2" />
      <LoadingSkeleton height={16} count={3} />
    </div>
  );
}

// Table skeleton for user/item lists
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            padding: '0.75rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <LoadingSkeleton height={40} width={40} className="rounded-full" />
          <div style={{ flex: 1 }}>
            <LoadingSkeleton height={18} width="60%" className="mb-2" />
            <LoadingSkeleton height={14} width="40%" />
          </div>
          <LoadingSkeleton height={36} width={80} />
        </div>
      ))}
    </div>
  );
}

// Stats card skeleton
export function StatsSkeleton() {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <LoadingSkeleton height={16} width={100} className="mb-4" />
      <LoadingSkeleton height={32} width={80} className="mb-2" />
      <LoadingSkeleton height={14} width={60} />
    </div>
  );
}
