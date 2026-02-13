'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
  imageUrl: string;
}

export default function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = async () => {
    try {
      // Use server-side proxy to avoid CORS issues
      const downloadUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `movie-style-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Image Container */}
      <div className="relative rounded overflow-hidden bg-white shadow-lg border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-2"></div>
              <p className="text-gray-600 text-sm">Loading...</p>
            </div>
          </div>
        )}
        <Image
          src={imageUrl}
          alt="Generated image"
          width={512}
          height={512}
          className="w-full h-auto"
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error('이미지 로드 실패:', e);
            setIsLoading(false);
          }}
          unoptimized
          priority
        />
      </div>

      {/* Download Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownload}
          className="bg-black text-white text-sm font-medium py-2 px-6 rounded hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          </svg>
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
