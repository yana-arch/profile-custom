import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-md';
      case 'rectangular':
      default:
        return 'rounded-none';
    }
  };

  const skeletonStyle = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              width: index === lines - 1 ? '75%' : '100%', // Last line shorter
              height: skeletonStyle.height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={skeletonStyle}
    />
  );
};

// Pre-built skeleton components for common use cases
export const TextSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton {...props} variant="text" />
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
    <Skeleton variant="rectangular" height={200} className="mb-4" />
    <Skeleton variant="text" width="100%" height={24} className="mb-2" />
    <Skeleton variant="text" width="80%" height={16} className="mb-4" />
    <div className="flex space-x-2">
      <Skeleton variant="text" width={60} height={20} />
      <Skeleton variant="text" width={60} height={20} />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Hero section */}
    <div className="text-center space-y-4">
      <Skeleton variant="circular" width={120} height={120} className="mx-auto" />
      <div className="space-y-2">
        <Skeleton variant="text" width="200px" height={32} className="mx-auto" />
        <Skeleton variant="text" width="150px" height={24} className="mx-auto" />
      </div>
    </div>

    {/* About section */}
    <div className="space-y-3">
      <Skeleton variant="text" width="100px" height={24} />
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="75%" height={16} />
      </div>
    </div>

    {/* Skills section */}
    <div className="space-y-3">
      <Skeleton variant="text" width="80px" height={24} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={40} />
        ))}
      </div>
    </div>
  </div>
);

export const ProjectSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
    <Skeleton variant="rectangular" height={200} />
    <div className="p-6 space-y-3">
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="60%" height={16} />
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={70} height={24} />
      </div>
    </div>
  </div>
);

export default Skeleton;
