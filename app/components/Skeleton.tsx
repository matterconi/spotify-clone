// components/Skeleton.tsx

import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded ${width} ${height} ${className}`}
    ></div>
  );
};

export default Skeleton;
