'use client';

import { useState, useEffect, useRef } from 'react';
import { MOVIE_STYLES } from '@/constants/movieStyles';
import MovieStyleCard from '@/components/MovieStyleCard';
import ImageDisplay from '@/components/ImageDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProgressBar from '@/components/ProgressBar';
import DetailedLoadingStatus from '@/components/DetailedLoadingStatus';
import { useComfyUI } from '@/hooks/useComfyUI';

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<string>('her');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const { progress, clientId, connectWebSocket, disconnectWebSocket, resetProgress } = useComfyUI();
  
  // Refs for carousel scrolling
  const carouselRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const selectedStyleRef = useRef<string>(selectedStyle);

  // Update ref when selectedStyle changes
  useEffect(() => {
    selectedStyleRef.current = selectedStyle;
  }, [selectedStyle]);

  // Create infinite loop by repeating movie styles (30 sets for smooth infinite scroll)
  const infiniteStyles = Array(30).fill(MOVIE_STYLES).flat();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  // Initialize carousel to center position
  useEffect(() => {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const cardWidth = 230;
      const gap = 32;
      const itemWidth = cardWidth + gap;
      // Start at set 15 (middle), index 0 (her)
      const startPosition = 15 * MOVIE_STYLES.length * itemWidth;
      carousel.scrollLeft = startPosition;
    }
  }, []);

  // Handle infinite scroll loop
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const cardWidth = 230;
      const gap = 32;
      const itemWidth = cardWidth + gap;
      const scrollLeft = carousel.scrollLeft;
      
      // Calculate current position
      const currentIndex = Math.round(scrollLeft / itemWidth);
      const currentSet = Math.floor(currentIndex / MOVIE_STYLES.length);
      const positionInSet = currentIndex % MOVIE_STYLES.length;
      
      // Get the actual selected style index to maintain after jump
      const currentSelectedStyle = selectedStyleRef.current;
      const selectedStyleIndex = currentSelectedStyle ? MOVIE_STYLES.findIndex(s => s.id === currentSelectedStyle) : positionInSet;
      
      // If too far right (past set 25), jump back to set 10
      if (currentSet >= 25) {
        isScrollingRef.current = true;
        const newPosition = (10 * MOVIE_STYLES.length + selectedStyleIndex) * itemWidth;
        carousel.scrollLeft = newPosition;
        setTimeout(() => { isScrollingRef.current = false; }, 100);
      }
      // If too far left (before set 5), jump forward to set 20
      else if (currentSet < 5) {
        isScrollingRef.current = true;
        const newPosition = (20 * MOVIE_STYLES.length + selectedStyleIndex) * itemWidth;
        carousel.scrollLeft = newPosition;
        setTimeout(() => { isScrollingRef.current = false; }, 100);
      }
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to selected card - find closest matching card
  const handleStyleSelect = (styleId: string, clickedIndex: number) => {
    setSelectedStyle(styleId);
    
    if (carouselRef.current && !isScrollingRef.current) {
      const carousel = carouselRef.current;
      const cardWidth = 230;
      const gap = 32;
      const itemWidth = cardWidth + gap;
      
      // Get current scroll position
      const currentScroll = carousel.scrollLeft;
      const currentIndex = Math.round(currentScroll / itemWidth);
      
      // Find the style index in MOVIE_STYLES array (0, 1, or 2)
      const styleIndex = MOVIE_STYLES.findIndex(s => s.id === styleId);
      
      // Calculate the closest occurrence of this style
      const currentSet = Math.floor(currentIndex / MOVIE_STYLES.length);
      const currentPositionInSet = currentIndex % MOVIE_STYLES.length;
      
      // Determine which direction is closer
      let targetSet = currentSet;
      let targetIndex;
      
      if (styleIndex > currentPositionInSet) {
        // Style is ahead in current set
        targetIndex = currentSet * MOVIE_STYLES.length + styleIndex;
      } else if (styleIndex < currentPositionInSet) {
        // Style is behind, check if next set is closer
        const distanceBack = currentPositionInSet - styleIndex;
        const distanceForward = MOVIE_STYLES.length - currentPositionInSet + styleIndex;
        
        if (distanceBack <= distanceForward) {
          // Go back in current set
          targetIndex = currentSet * MOVIE_STYLES.length + styleIndex;
        } else {
          // Go forward to next set
          targetIndex = (currentSet + 1) * MOVIE_STYLES.length + styleIndex;
        }
      } else {
        // Same style, already selected
        targetIndex = currentIndex;
      }
      
      const targetScroll = targetIndex * itemWidth;
      
      carousel.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleGenerate = async () => {
    // 입력 검증
    if (!selectedStyle) {
      setError('영화 스타일을 선택해주세요.');
      return;
    }
    if (!userInput.trim()) {
      setError('이미지 설명을 입력해주세요.');
      return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedImageUrl('');
    setLoadingStartTime(Date.now());
    resetProgress();

    console.log('🚀 이미지 생성 시작:', {
      style: selectedStyle,
      userInput: userInput.trim(),
      timestamp: new Date().toISOString()
    });

    // 폴링 기반 가짜 진행률 (WebSocket 실패 시 대비)
    let estimatedProgress = 0;
    const progressInterval = setInterval(() => {
      estimatedProgress += Math.random() * 3;
      if (estimatedProgress > 95) estimatedProgress = 95; // 95%에서 멈춤
      
      // WebSocket이 작동하지 않으면 예상 진행률 표시
      if (!progress || progress.percentage === 0) {
        resetProgress();
        // 간단한 진행률만 표시하기 위해 수동으로 설정하지 않음
      }
    }, 2000);

    try {
      // API 요청 전송
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: selectedStyle,
          userInput: userInput.trim(),
          clientId: clientId,
        }),
      });

      const data = await response.json();

      console.log('📦 API 응답 수신:', data);

      if (!response.ok) {
        clearInterval(progressInterval);
        console.error('❌ API 오류:', data);
        const errorMsg = data.details ? `${data.error}\n상세: ${data.details}` : data.error || '이미지 생성에 실패했습니다.';
        throw new Error(errorMsg);
      }

      // WebSocket으로 실시간 진행 상황 추적 (선택적)
      if (data.promptId) {
        console.log('🔌 WebSocket 연결 시도:', data.promptId);
        connectWebSocket(data.promptId).catch(() => {
          console.info('💡 실시간 진행률을 사용할 수 없습니다. 일반 모드로 계속 진행합니다.');
        });
      }

      clearInterval(progressInterval);
      console.log('✅ 이미지 생성 완료:', data.imageUrl);
      setGeneratedImageUrl(data.imageUrl);
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      disconnectWebSocket();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="w-full px-4 py-8">
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Movie Style Generator
          </h1>
        </header>

        {/* Movie Style Selection - Infinite Carousel */}
        <section className="mb-8">
          <div className="relative w-full overflow-hidden flex justify-center">
            <div 
              ref={carouselRef}
              className="flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide justify-start"
              style={{ 
                maxWidth: '850px',
                width: '100%'
              }}
            >
              {/* Left padding for centering - (850 - 230) / 2 = 310px */}
              <div className="flex-shrink-0" style={{ width: '310px' }} />
              
              {infiniteStyles.map((style, index) => (
                <div 
                  key={`${style.id}-${index}`}
                  className="snap-center flex items-center flex-shrink-0"
                  style={{ marginRight: '32px' }}
                >
                  <MovieStyleCard
                    style={style}
                    isSelected={selectedStyle === style.id}
                    onSelect={() => handleStyleSelect(style.id, index)}
                  />
                </div>
              ))}
              
              {/* Right padding for centering */}
              <div className="flex-shrink-0" style={{ width: '310px' }} />
            </div>
          </div>
          
          {/* Selected Movie Info */}
          {selectedStyle && (
            <div className="flex justify-center items-center mt-1 animate-fadeIn">
              {MOVIE_STYLES.filter(s => s.id === selectedStyle).map((style) => (
                <div key={style.id} className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {style.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {style.id === 'her' && '2013'}
                    {style.id === 'harry-potter' && '2001'}
                    {style.id === 'grand-budapest-hotel' && '2014'}
                  </p>
                  <div className="max-w-md border-l-2 border-gray-800 pl-4 text-left">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {style.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Input - Centered */}
        <section className="mb-6 flex flex-col items-center">
          <div className="w-full max-w-xl">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="women reading a book, dog sleeping..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none text-base"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </section>

        {/* Generate Button - Centered */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !selectedStyle || !userInput.trim()}
            className={`
              px-8 py-2.5 rounded-md font-medium text-sm
              transition-all duration-200
              ${
                isLoading || !selectedStyle || !userInput.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }
            `}
          >
            {isLoading ? 'generating...' : 'generate'}
          </button>
        </div>

        {/* Error Message - Centered */}
        {error && (
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-700 text-center text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Centered */}
        {isLoading && (
          <div className="animate-fadeIn flex justify-center">
            {progress ? (
              <ProgressBar progress={progress} />
            ) : (
              <DetailedLoadingStatus startTime={loadingStartTime} />
            )}
          </div>
        )}

        {/* Generated Image - Centered */}
        {generatedImageUrl && !isLoading && (
          <section className="mb-12 animate-fadeIn flex flex-col items-center">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Image Generated!
              </h2>
            </div>
            <ImageDisplay imageUrl={generatedImageUrl} />
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 text-xs">
            ComfyUI should be working on localhost:8188
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Powered by ComfyUI & Stable Diffusion
          </p>
        </div>
      </footer>
    </div>
  );
}
