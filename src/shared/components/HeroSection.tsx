import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <section className={`py-12 sm:py-16 md:py-20 px-4 text-center ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;