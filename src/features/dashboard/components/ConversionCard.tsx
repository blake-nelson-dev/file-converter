import React from 'react';
import Button from '../../../shared/components/Button';

interface ConversionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ConversionCard: React.FC<ConversionCardProps> = ({
  icon,
  title,
  description,
  buttonText = 'Start Converting',
  onButtonClick
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 sm:p-8 text-center group hover:scale-105">
      <div className="mb-4 transition-transform group-hover:scale-110 duration-200">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">{description}</p>
      <Button 
        variant="primary" 
        className="w-full"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ConversionCard;