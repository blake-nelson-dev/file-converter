import React from 'react';
import Button from './Button';

export type SortOrder = 'asc' | 'desc';

interface SortButtonProps {
  sortOrder: SortOrder;
  onToggle: () => void;
  className?: string;
}

const SortButton: React.FC<SortButtonProps> = ({ 
  sortOrder, 
  onToggle, 
  className = "" 
}) => {
  return (
    <Button
      variant="outline"
      size="medium"
      onClick={onToggle}
      className={`px-3 py-2 ${className}`}
      title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
    >
      {sortOrder === 'asc' ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      )}
    </Button>
  );
};

export default SortButton;