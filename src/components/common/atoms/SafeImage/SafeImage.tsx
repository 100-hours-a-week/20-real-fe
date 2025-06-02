'use client';

import Image, { ImageProps, StaticImageData } from 'next/image';

import { useState } from 'react';

type SafeImageBaseProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | StaticImageData | null;
  alt?: string | null;
  className?: string;
  fallbackSrc?: string | StaticImageData;
};

// fill 옵션을 사용한 경우 크기를 지정하지 않음
type SafeImageWithFill = SafeImageBaseProps & {
  fill: true;
  width?: never;
  height?: never;
};

// fill 옵션을 사용핮 않으면 반드시 크기를 지정해야함
type SafeImageWithDimensions = SafeImageBaseProps & {
  fill?: false;
  width: number;
  height: number;
};

type SafeImageProps = SafeImageWithFill | SafeImageWithDimensions;

export function SafeImage({ src, alt, className = '', fallbackSrc, fill, width, height, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const safeAlt = alt || '이미지';
  const isValidSrc = src && (typeof src !== 'string' || src.trim() !== '');

  if (!isValidSrc || hasError) {
    if (fallbackSrc) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={safeAlt}
          className={className}
          fill={fill}
          width={width}
          height={height}
        />
      );
    }

    return (
      <div
        {...props}
        style={fill ? {} : { width, height }}
        className={`w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs ${className}`}
      ></div>
    );
  }

  return (
    <Image
      {...props}
      src={src!}
      alt={safeAlt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      onError={() => setHasError(true)}
    />
  );
}
