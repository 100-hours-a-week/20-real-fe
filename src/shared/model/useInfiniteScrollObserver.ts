import { useEffect, useRef } from 'react';

interface UseInfiniteScrollObserverParams {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
}

export function useInfiniteScrollObserver(params?: UseInfiniteScrollObserverParams) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!params) return;
    const { fetchNextPage, hasNextPage, isFetchingNextPage } = params;
    if (!hasNextPage || isFetchingNextPage) return;

    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (observerRef.current) {
      observerInstance.current.observe(observerRef.current);
    }

    return () => {
      observerInstance.current?.disconnect();
    };
  }, [params]);

  return observerRef;
}
