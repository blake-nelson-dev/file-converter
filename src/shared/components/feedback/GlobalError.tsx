import React from 'react';
import { Button } from '../ui';

interface GlobalErrorProps {
  message?: string;
  onRetry?: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry 
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md w-full">
        <div className="mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>
        
        <div className="space-y-3">
          {onRetry ? (
            <Button 
              onClick={onRetry}
              className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          ) : (
            <Button 
              onClick={handleRefresh}
              className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh Page
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full justify-center"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;