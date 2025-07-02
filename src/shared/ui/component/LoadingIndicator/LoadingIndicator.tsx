import { HTMLAttributes, RefObject } from 'react';

interface LoadingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  // 무한스크롤
  loadingRef?: RefObject<HTMLDivElement | null>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;

  // 일반 로딩
  isLoading?: boolean;
}

export function LoadingIndicator({
  loadingRef,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  ...rest
}: LoadingIndicatorProps) {
  const shouldShow = isLoading || hasNextPage;

  if (!shouldShow) return null;

  return (
    <div ref={loadingRef} className="flex justify-center pt-8" role="status" {...rest}>
      {isLoading ||
        (isFetchingNextPage && (
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
        ))}
    </div>
  );
}
