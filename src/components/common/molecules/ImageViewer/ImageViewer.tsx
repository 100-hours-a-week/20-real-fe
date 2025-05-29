'use client';

import { useState } from 'react';

import { SafeImage } from '@/components/common/atoms/SafeImage';

interface ImageViewerProps {
  imageUrl: string;
  imageName?: string;
  className?: string;
  onClick?: () => void; // 외부 클릭 핸들러 (선택)
}

export function ImageViewer({ imageUrl, imageName, className, onClick }: ImageViewerProps) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleClick = () => {
    if (onClick) {
      onClick(); // 외부 동작 우선
    } else {
      setModalImage(imageUrl); // 기본: 모달 열기
    }
  };

  return (
    <div className={className}>
      {/* 이미지 */}
      <div className="rounded-xl overflow-hidden mb-3 shadow-sm relative w-full h-48">
        <SafeImage
          src={imageUrl}
          alt={imageName ?? imageUrl}
          className="w-full h-full object-cover object-center cursor-pointer"
          width={400}
          height={200}
          onClick={handleClick}
        />
      </div>

      {/* 모달 */}
      {modalImage && !onClick && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <div className="relative w-full max-w-3xl p-4">
            <SafeImage
              src={modalImage}
              alt={imageName ?? modalImage}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
