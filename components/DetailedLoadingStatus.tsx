'use client';

import { useEffect, useState } from 'react';

interface DetailedLoadingStatusProps {
  startTime: number;
}

export default function DetailedLoadingStatus({ startTime }: DetailedLoadingStatusProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStage, setCurrentStage] = useState('워크플로우 전송 중...');

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);

      // 시간에 따른 단계 표시
      if (elapsed < 3) {
        setCurrentStage('Sending workflow...');
      } else if (elapsed < 10) {
        setCurrentStage('Waiting for processing...');
      } else if (elapsed < 30) {
        setCurrentStage('Generating image (this takes the longest)...');
      } else if (elapsed < 60) {
        setCurrentStage('Generating image (almost done)...');
      } else if (elapsed < 90) {
        setCurrentStage('Complex images may take longer...');
      } else {
        setCurrentStage('Taking longer than expected. Check ComfyUI status.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`;
  };

  const getProgressEstimate = () => {
    if (elapsedTime < 5) return 5;
    if (elapsedTime < 15) return 20;
    if (elapsedTime < 30) return 50;
    if (elapsedTime < 45) return 75;
    if (elapsedTime < 60) return 85;
    return 95;
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 animate-fadeIn">
      {/* Time Counter */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-white rounded px-4 py-2 shadow border border-gray-200">
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
          <span className="text-gray-900 text-lg font-semibold">{formatTime(elapsedTime)}</span>
          <span className="text-gray-500 text-xs">elapsed</span>
        </div>
      </div>

      {/* Current Stage */}
      <div className="text-center mb-6">
        <p className="text-base text-gray-900 font-medium mb-1">{currentStage}</p>
        <p className="text-xs text-gray-500">
          Average time: 20-60 seconds
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gray-800 rounded transition-all duration-1000 ease-out"
            style={{ width: `${getProgressEstimate()}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Start</span>
          <span>{getProgressEstimate()}%</span>
          <span>Done</span>
        </div>
      </div>

      {/* Loading Animation */}
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Status Steps */}
      <div className="space-y-2 text-sm">
        <StatusStep 
          completed={elapsedTime > 2} 
          current={elapsedTime <= 2}
          label="Sending workflow"
        />
        <StatusStep 
          completed={elapsedTime > 10} 
          current={elapsedTime > 2 && elapsedTime <= 10}
          label="Waiting in queue"
        />
        <StatusStep 
          completed={elapsedTime > 60} 
          current={elapsedTime > 10 && elapsedTime <= 60}
          label="Generating image"
        />
        <StatusStep 
          completed={false} 
          current={elapsedTime > 60}
          label="Finalizing"
        />
      </div>

      {/* Warning if taking too long */}
      {elapsedTime > 90 && (
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-900 text-xs font-medium mb-1">⚠️ Taking longer than expected</p>
          <p className="text-yellow-700 text-xs">
            Check ComfyUI terminal for errors. Try refreshing if needed.
          </p>
        </div>
      )}
    </div>
  );
}

interface StatusStepProps {
  completed: boolean;
  current: boolean;
  label: string;
}

function StatusStep({ completed, current, label }: StatusStepProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`
        w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
        ${completed ? 'bg-green-500' : current ? 'bg-gray-800 animate-pulse' : 'bg-gray-200'}
      `}>
        {completed ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : current ? (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        ) : (
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        )}
      </div>
      <span className={`text-xs ${completed ? 'text-green-600' : current ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
