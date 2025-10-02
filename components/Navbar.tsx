"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Button from "./ui/Button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle URL fragments when navigating from other pages
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const navbar = document.querySelector("nav");
          const navbarHeight = navbar ? navbar.offsetHeight : 100;
          const elementPosition = element.offsetTop - navbarHeight;

          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navbar = document.querySelector("nav");
      const navbarHeight = navbar ? navbar.offsetHeight : 100;
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const navigateToHome = () => {
    if (pathname !== "/") {
      router.push("/");
    } else {
      // Scroll to top of page when on home page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-brand-beige/90 backdrop-blur-md shadow-organic-lg border-b border-brand-secondary/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <button
              onClick={navigateToHome}
              className="text-2xl font-bold text-brand-text hover:gradient-text transition-all duration-300"
            >
              Winton Gee
            </button>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("about")}
              className="text-brand-text hover:text-brand-primary font-medium transition-colors duration-200 relative group"
            >
              Journey
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-primary-light group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("projects")}
              className="text-brand-text hover:text-brand-primary font-medium transition-colors duration-200 relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-primary-light group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            {/* Chat link - Hidden but functional */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("chat")}
              className="hidden text-brand-text hover:text-brand-primary font-medium transition-colors duration-200 relative group"
            >
              Chat
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-primary-light group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            <Button
              href="/resume/AIML_Resume_WintonGee.pdf"
              download="Winton_Gee_Resume.pdf"
              variant="outline"
              size="md"
              className="px-4 py-2"
            >
              Download Resume
            </Button>
            <Button
              href="mailto:wintongee@gmail.com?subject=Let's Connect - Portfolio Inquiry&body=Hi Winton,%0D%0A%0D%0AI came across your portfolio and would like to connect regarding potential opportunities.%0D%0A%0D%0ABest regards,"
              size="md"
              className="px-6 py-2"
            >
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-text hover:text-brand-primary transition-colors duration-200 relative z-50"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 bg-brand-beige/95 backdrop-blur-md border-b border-brand-secondary/30 z-50 md:hidden"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-6">
                  {/* Mobile Navigation Links */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => scrollToSection("about")}
                    className="text-left text-lg font-medium text-brand-text hover:text-brand-primary transition-colors duration-200 py-2"
                  >
                    Journey
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => scrollToSection("projects")}
                    className="text-left text-lg font-medium text-brand-text hover:text-brand-primary transition-colors duration-200 py-2"
                  >
                    Projects
                  </motion.button>

                  {/* Chat link - Hidden but functional */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => scrollToSection("chat")}
                    className="hidden text-left text-lg font-medium text-brand-text hover:text-brand-primary transition-colors duration-200 py-2"
                  >
                    Chat
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="py-2"
                  >
                    <Button
                      href="/resume/AIML_Resume_WintonGee.pdf"
                      download="Winton_Gee_Resume.pdf"
                      variant="outline"
                      size="md"
                      className="w-full justify-center"
                    >
                      Download Resume
                    </Button>
                  </motion.div>

                  {/* Mobile Contact Button */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4"
                  >
                    <Button
                      href="mailto:wintongee@gmail.com?subject=Let's Connect - Portfolio Inquiry&body=Hi Winton,%0D%0A%0D%0AI came across your portfolio and would like to connect regarding potential opportunities.%0D%0A%0D%0ABest regards,"
                      size="lg"
                      className="w-full justify-center"
                    >
                      Contact Me
                    </Button>
                  </motion.div>

                  {/* Social Links for Mobile */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex justify-center space-x-6 pt-4 border-t border-brand-secondary/30"
                  >
                    <a
                      href="https://linkedin.com/in/wintongee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-text-light hover:text-brand-primary transition-colors duration-200"
                      aria-label="Visit LinkedIn profile"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/wintongee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-text-light hover:text-brand-primary transition-colors duration-200"
                      aria-label="Visit GitHub profile"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
