import React from 'react';
import HeroSection from '../../../shared/components/HeroSection';
import ConversionCard from '../components/ConversionCard';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const categories: Category[] = [
    {
      id: 'documents',
      title: 'Documents',
      description: 'Convert PDFs, Word docs, presentations, and more',
      icon: (
        <svg className="w-12 h-12 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Selected category: ${categoryId}`);
    // TODO: Navigate to category page or show conversion options
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection 
        title="Convert Files with Ease"
        subtitle="Fast, secure, and intelligent file conversion powered by AI"
      />
      
      <section className="px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category) => (
              <ConversionCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                buttonText="Select"
                onButtonClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;