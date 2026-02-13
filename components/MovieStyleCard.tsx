import { MovieStyle } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface MovieStyleCardProps {
  style: MovieStyle;
  isSelected: boolean;
  onSelect: () => void;
}

const movieImages: Record<string, string> = {
  'her': '/her.jpg',
  'harry-potter': '/harry-potter.jpg',
  'grand-budapest-hotel': '/grand-budapest-hotel.jpg'
};

const movieYears: Record<string, string> = {
  'her': '2013',
  'harry-potter': '2001',
  'grand-budapest-hotel': '2014'
};

const fallbackEmojis: Record<string, string> = {
  'her': '💗',
  'harry-potter': '⚡',
  'grand-budapest-hotel': '🏨'
};

export default function MovieStyleCard({ style, isSelected, onSelect }: MovieStyleCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onSelect}
      className={`
        flex-shrink-0 transition-all duration-300 ease-out
        ${isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-40 hover:opacity-60'}
      `}
      style={{
        width: '230px',
      }}
    >
      {/* Movie Poster Image */}
      <div 
        className={`
          relative overflow-hidden bg-gradient-to-br ${style.color}
          transition-all duration-300
          ${isSelected ? 'ring-2 ring-black' : ''}
        `}
        style={{
          width: '230px',
          height: '150px',
          borderRadius: '30px 0 30px 0',
        }}
      >
        {!imageError && movieImages[style.id] ? (
          <Image
            src={movieImages[style.id]}
            alt={style.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {fallbackEmojis[style.id]}
          </div>
        )}
      </div>
    </button>
  );
}
