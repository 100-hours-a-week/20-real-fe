'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { createContext, ReactNode, useContext, useState } from 'react';

import { Button } from '@/components/common/atoms/Button';
import { ImageViewer } from '@/components/common/molecules/ImageViewer';

export interface SingleImage {
  id: number;
  url: string;
  fileName?: string;
  title?: string;
}

interface ImageCarouselContextProps {
  images: SingleImage[];
  current: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
}

const ImageCarouselContext = createContext<ImageCarouselContextProps | null>(null);

function useImageCarousel() {
  const context = useContext(ImageCarouselContext);
  if (!context) throw new Error('ImageCarousel compound components must be used within <ImageCarousel.Root>');
  return context;
}

function Root({ images, children }: { images: SingleImage[]; children: ReactNode }) {
  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => setCurrent(index);
  const next = () => setCurrent((prev) => Math.min(prev + 1, images.length - 1));
  const prev = () => setCurrent((prev) => Math.max(prev - 1, 0));

  return (
    <ImageCarouselContext.Provider value={{ images, current, goTo, next, prev }}>
      {children}
    </ImageCarouselContext.Provider>
  );
}

function ImageList({ onImageClick }: { onImageClick?: (index: number) => void }) {
  const { images, current } = useImageCarousel();

  return (
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
            imageName={image.fileName}
            onClick={onImageClick ? () => onImageClick(index) : undefined}
          />
        </div>
      ))}
    </div>
  );
}

function Controls() {
  const { current, images, next, prev } = useImageCarousel();

  return (
    <>
      {current > 0 && (
        <Button
          variant="plain"
          size="icon"
          className="absolute left-2 top-2/5 rounded-full bg-white w-9 h-9 opacity-80"
          onClick={prev}
        >
          <ChevronLeft />
        </Button>
      )}
      {current < images.length - 1 && (
        <Button
          variant="plain"
          size="icon"
          className="absolute right-2 top-2/5 rounded-full bg-white w-9 h-9 opacity-80"
          onClick={next}
        >
          <ChevronRight />
        </Button>
      )}
    </>
  );
}

function Indicators() {
  const { images, current, goTo } = useImageCarousel();

  return (
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
  );
}

function ImageTitle() {
  const { images, current } = useImageCarousel();
  const title = images[current]?.title;

  if (!title) return null;

  return (
    <div className="absolute bottom-2 left-2 text-white text-lg font-medium bg-black/30 px-2 py-1 rounded z-10 line-clamp-1">
      {title}
    </div>
  );
}

// 컴파운드 컴포넌트 API 구성
export const ImageCarousel = {
  Root,
  ImageList,
  Controls,
  Indicators,
  ImageTitle,
};
