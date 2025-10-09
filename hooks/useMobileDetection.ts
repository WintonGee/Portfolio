import { useState, useEffect } from "react";

/**
 * Custom hook for detecting mobile screen size
 * @param breakpoint - Breakpoint in pixels (default: 768)
 * @returns Boolean indicating if screen is mobile size
 */
export function useMobileDetection(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

