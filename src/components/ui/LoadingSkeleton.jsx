import React from "react";

const LoadingSkeleton = ({ count = 1 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg aspect-square"></div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
