import { RefObject } from 'react';

interface LoadingIndicatorProps {
  loadingRef: RefObject<HTMLDivElement | null>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
}

export function LoadingIndicator({ loadingRef, hasNextPage, isFetchingNextPage }: LoadingIndicatorProps) {
  if (!hasNextPage) return null;

  return (
    <div ref={loadingRef} className="flex justify-center pt-8">
      {isFetchingNextPage && (
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
      )}
    </div>
  );
}
