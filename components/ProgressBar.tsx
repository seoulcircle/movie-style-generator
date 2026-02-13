'use client';

import { ProgressData } from '@/hooks/useComfyUI';

interface ProgressBarProps {
  progress: ProgressData;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8 animate-fadeIn">
      {/* Progress Info */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-gray-900 text-base font-semibold">
            {progress.stage}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            Step {progress.value} / {progress.max}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {progress.percentage}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gray-800 rounded transition-all duration-500 ease-out"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Estimated time */}
      <div className="mt-3 text-center">
        <p className="text-gray-500 text-xs">
          {progress.percentage < 20 
            ? 'Starting image generation...'
            : progress.percentage < 100 
              ? 'Processing... (20-60 seconds)'
              : 'Almost done!'}
        </p>
      </div>

      {/* Additional info */}
      {progress.percentage > 0 && progress.percentage < 100 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white rounded px-3 py-1.5 shadow-sm border border-gray-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 text-xs">Processing</span>
          </div>
        </div>
      )}
    </div>
  );
}
