import { useState, useEffect } from "react";

/**
 * Custom hook for detecting scroll position
 * @param threshold - Scroll threshold in pixels (default: 10)
 * @returns Boolean indicating if scrolled past threshold
 */
export function useScrollDetection(threshold: number = 10) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}

