import React from 'react';

const GlobalLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading ConvertStudio...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;