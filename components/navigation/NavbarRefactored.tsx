"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useScrollDetection, useKeyboardNavigation } from "../../hooks";
import { scrollToElement } from "../../lib/utils";
import { NAVIGATION_ITEMS } from "../../lib/constants";
import Button from "../ui/Button";
import MobileMenu from "./MobileMenu";

/**
 * Refactored navbar component with improved structure
 */
export default function NavbarRefactored() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isScrolled = useScrollDetection();

  useKeyboardNavigation(isMobileMenuOpen, () => setIsMobileMenuOpen(false));

  // Handle URL fragments when navigating from other pages
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToElement(hash);
      }, 100);
    }
  }, [pathname]);

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      scrollToElement(href);
    } else {
      router.push(href);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <button
                onClick={() => handleNavigation("#hero")}
                className="text-2xl font-bold text-brand-text hover:text-brand-primary transition-colors"
              >
                WG
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {NAVIGATION_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className="text-brand-text hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                variant="primary"
                onClick={() => handleNavigation("#contact")}
              >
                Get In Touch
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-brand-text hover:text-brand-primary p-2"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigation}
      />
    </>
  );
}

