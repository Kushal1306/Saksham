import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* 404 Header */}
        <h1 className="text-9xl font-bold text-black-600 mb-4">404</h1>
        
        {/* Animated waves */}
        {/* <div className="relative h-24 overflow-hidden my-8">
          <div className="absolute w-full">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="absolute w-full h-24 opacity-30"
                style={{
                  background: `rgba(59, 130, 246, ${0.3 - index * 0.1})`,
                  animation: `wave ${2 + index * 0.5}s infinite ease-in-out`,
                  animationDelay: `${index * 0.3}s`,
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  transform: 'scale(1.5)',
                }}
              />
            ))}
          </div>
        </div> */}

        {/* Main content */}
        <div className="space-y-6 px-4">
          <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Oops! It seems like you've ventured into uncharted waters. 
            The page you're looking for might have moved or no longer exists.
          </p>

          {/* Search bar */}
          {/* <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Try searching for something else..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div> */}

          {/* Action buttons */}
          {/* <div className="flex justify-center gap-4 mt-8">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Home size={20} />
              Go Home
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0) scale(1.5);
          }
          50% {
            transform: translateY(10px) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;