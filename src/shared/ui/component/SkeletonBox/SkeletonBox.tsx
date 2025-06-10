import React, { HTMLAttributes } from 'react';

interface SkeletonBoxProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SkeletonBox({ className = '', ...props }: SkeletonBoxProps) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} {...props} />;
}
