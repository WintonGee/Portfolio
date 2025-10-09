import { useEffect } from "react";

/**
 * Custom hook for handling keyboard navigation (Escape key)
 * @param isOpen - Boolean indicating if menu/modal is open
 * @param onClose - Function to call when Escape is pressed
 */
export function useKeyboardNavigation(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
}

