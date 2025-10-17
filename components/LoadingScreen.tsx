'use client';

import { Calendar } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          
          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Loading...</h3>
          <p className="text-sm text-gray-600">Please wait a moment</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
