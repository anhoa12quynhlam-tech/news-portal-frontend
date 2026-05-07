/**
 * useInfiniteScroll Hook
 * Handles infinite scroll functionality
 */

import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(onLoadMore: () => void) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        console.log("Infinite scroll triggered");
        onLoadMore();
      }
    },
    [onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "200px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleIntersection]);

  return {
    setObserverTarget: observerTarget,
  };
}
