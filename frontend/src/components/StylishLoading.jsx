import React from 'react';
import { Loader2 } from 'lucide-react';

const StylishLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
        <div className="animate-spin text-purple-600">
          <Loader2 size={48} />
        </div>
        
        {/* Loading text with gradient */}
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Loading...
        </div>
        
        {/* Animated dots */}
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default StylishLoading;