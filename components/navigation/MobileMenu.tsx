"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NAVIGATION_ITEMS } from "../../lib/constants";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";
import { scrollToElement } from "../../lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

/**
 * Mobile navigation menu component
 */
export default function MobileMenu({
  isOpen,
  onClose,
  onNavigate,
}: MobileMenuProps) {
  useKeyboardNavigation(isOpen, onClose);

  const handleItemClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg z-50 flex flex-col"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-brand-text">Menu</h2>
                <button
                  onClick={onClose}
                  className="text-brand-text hover:text-brand-primary transition-colors"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleItemClick(item.href)}
                    className="block w-full text-left py-3 px-4 rounded-lg hover:bg-brand-primary/10 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

