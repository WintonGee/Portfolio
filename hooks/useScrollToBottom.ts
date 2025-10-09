import { useRef, useCallback } from "react";

/**
 * Custom hook for scrolling to bottom of a container
 * @param delay - Delay in milliseconds before scrolling (default: 100)
 * @returns Object with containerRef and scrollToBottom function
 */
export function useScrollToBottom(delay: number = 100) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, delay);
  }, [delay]);

  return { containerRef, scrollToBottom };
}

