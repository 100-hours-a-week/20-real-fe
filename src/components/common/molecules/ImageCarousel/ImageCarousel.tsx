'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/common/atoms/Button';
import { ImageViewer } from '@/components/common/molecules/ImageViewer';

export interface SingleImage {
  id: number;
  url: string;
  name?: string;
}

interface ImageCarouselProps {
  images: SingleImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => {
    setCurrent(index);
  };

  return (
    <div>
      {/* 이미지 */}
      <div className="rounded-xl overflow-hidden mb-3 shadow-sm relative w-full h-48">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ImageViewer
              className="w-full h-full object-cover object-center cursor-pointer"
              imageUrl={image.url}
              imageName={image.name}
            />
          </div>
        ))}

        {current > 0 && (
          <Button
            variant="plain"
            size="icon"
            className="flex justify-center items-center absolute left-2 top-2/5 rounded-full bg-white w-9 h-9 opacity-80"
            onClick={() => setCurrent(current - 1)}
          >
            <ChevronLeft />
          </Button>
        )}

        {current < images.length - 1 && (
          <Button
            variant="plain"
            size="icon"
            className="flex justify-center items-center absolute right-2 top-2/5 rounded-full bg-white w-9 h-9 opacity-80"
            onClick={() => setCurrent(current + 1)}
          >
            <ChevronRight />
          </Button>
        )}
      </div>

      {/* 네비게이션 점 */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-1">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => goTo(index)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
                index === current ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
