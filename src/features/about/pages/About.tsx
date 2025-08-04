import React from 'react';
import { HeroSection, Button } from '../../../shared/components';

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection 
        title="About ConvertStudio"
        subtitle="Transforming the way you convert files with AI-powered simplicity"
      />
      
      {/* Mission Statement */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            To provide an easy, sleek way for users to convert files and use AI to improve everyday tasks. 
            We cater new technology to help with the daily tasks of users, making file conversion 
            seamless, secure, and intelligent.
          </p>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="px-4 py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12">
            Why Choose ConvertStudio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Intelligence</h3>
              <p className="text-gray-600">
                Advanced AI technology enhances your conversions with OCR, smart formatting, 
                and intelligent file optimization.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Security</h3>
              <p className="text-gray-600">
                Your files are processed with enterprise-grade security. Complete privacy 
                and data protection you can trust.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Modern cloud infrastructure ensures rapid conversions with real-time progress 
                tracking and instant results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                ConvertStudio was founded on July 1, 2025, born from recognizing an opportunity 
                to revolutionize how people interact with file conversions. In a world where 
                digital documents are central to productivity, we saw the need for a more 
                intelligent, user-friendly solution.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What started as a solo development project has grown into a comprehensive platform 
                that combines cutting-edge AI technology with intuitive design, making complex 
                file conversions accessible to everyone.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700">BN</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Blake Nelson</p>
                  <p className="text-sm text-gray-600">Founder & Developer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Privacy First</h4>
                    <p className="text-sm text-gray-600">Your data is yours. We never store or share your files.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Security</h4>
                    <p className="text-sm text-gray-600">Enterprise-grade security for all conversions.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ease of Use</h4>
                    <p className="text-sm text-gray-600">Simple, intuitive design that anyone can master.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Have questions or need support? We're here to help you make the most of ConvertStudio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              onClick={() => window.location.href = 'mailto:blakenelson.dev@gmail.com'}
              className="px-6 py-3"
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="px-6 py-3"
            >
              View Help Center
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Email: <a href="mailto:blakenelson.dev@gmail.com" className="text-blue-600 hover:text-blue-800">blakenelson.dev@gmail.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;