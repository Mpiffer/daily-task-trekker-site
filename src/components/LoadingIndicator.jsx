import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Carregando o sistema...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;