import React from 'react';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
      {message}
    </div>
  );
};

export default SuccessMessage;