// TrackSkeleton.tsx

import React from 'react';

const TrackSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 p-2 animate-pulse">
      {/* Album Art Placeholder */}
      <div className="w-12 h-12 bg-gray-300 rounded"></div>

      {/* Track Information Placeholder */}
      <div className="flex-1">
        <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>

      {/* Controls Placeholder */}
      <div className="flex space-x-2">
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default TrackSkeleton;
