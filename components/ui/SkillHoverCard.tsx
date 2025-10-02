"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { SkillData } from "@/data/skills-data";

interface SkillHoverCardProps {
  skill: SkillData;
  children: React.ReactNode;
  className?: string;
}

const PROFICIENCY_STYLES = {
  beginner:
    "bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30",
  intermediate:
    "bg-brand-primary/20 text-brand-primary border-brand-primary/30",
  advanced:
    "bg-brand-primary-dark/20 text-brand-primary-dark border-brand-primary-dark/30",
  expert:
    "bg-brand-text-dark/20 text-brand-text-dark border-brand-text-dark/30",
} as const;

export function SkillHoverCard({
  skill,
  children,
  className = "",
}: SkillHoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [arrowPosition, setArrowPosition] = useState({
    x: 0,
    y: 0,
    isAbove: false,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const calculatePosition = () => {
    if (!triggerRef.current || !cardRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 24; // padding from viewport edges

    // Get actual card dimensions with fallback
    const cardRect = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRect.width || 400; // fallback width
    const cardHeight = cardRect.height || 300; // fallback height

    // Standardized positioning - all cards appear in top-left area
    const maxAllowedWidth = viewportWidth - padding * 2;
    const effectiveCardWidth = Math.min(cardWidth, maxAllowedWidth);

    // Fixed position in top-left area with comfortable spacing
    let x = padding + 40; // Add extra spacing from left edge
    let y = padding + 60; // Add extra spacing from top edge
    let isAbove = false;

    // Ensure the card doesn't go off-screen with the new positioning
    x = Math.max(
      padding,
      Math.min(x, viewportWidth - effectiveCardWidth - padding)
    );
    y = Math.max(padding, Math.min(y, viewportHeight - cardHeight - padding));

    // Calculate arrow position to point to trigger
    const triggerCenterX = rect.left + rect.width / 2;
    const triggerCenterY = rect.top + rect.height / 2;

    // Calculate arrow position to point from card to trigger
    const arrowX = Math.max(
      20,
      Math.min(effectiveCardWidth - 20, triggerCenterX - x)
    );
    const arrowY = Math.max(20, Math.min(cardHeight - 20, triggerCenterY - y));

    // Debug logging (remove in production)
    console.log("Card positioning:", {
      viewport: { width: viewportWidth, height: viewportHeight },
      card: { width: cardWidth, height: cardHeight },
      position: { x, y },
      trigger: { centerX: triggerCenterX, centerY: triggerCenterY },
      arrow: { x: arrowX, y: arrowY },
    });

    setPosition({ x, y });
    setArrowPosition({ x: arrowX, y: arrowY, isAbove });
  };

  useEffect(() => {
    setMounted(true);

    // Handle window resize to recalculate position
    const handleResize = () => {
      if (isVisible) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          calculatePosition();
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // Cleanup states on unmount
      setIsVisible(false);
      setIsExpanded(false);
    };
  }, [isVisible]);

  // Recalculate position when card becomes visible
  useEffect(() => {
    if (isVisible && mounted) {
      requestAnimationFrame(() => {
        requestAnimationFrame(calculatePosition);
      });
    }
  }, [isVisible, mounted]);

  // Handle click outside to close expanded view
  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          cardRef.current &&
          !cardRef.current.contains(event.target as Node)
        ) {
          handleCloseExpanded();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    setIsVisible(true);
    // Use requestAnimationFrame to ensure DOM is updated before calculating position
    requestAnimationFrame(() => {
      requestAnimationFrame(calculatePosition);
    });
  };

  const handleMouseLeave = () => {
    if (!isExpanded) {
      setIsVisible(false);
    }
  };

  const handleCardMouseEnter = () => {
    // Keep card visible when hovering over it
    if (isExpanded) {
      setIsVisible(true);
    }
  };

  const handleCardMouseLeave = () => {
    // Only close if not expanded
    if (!isExpanded) {
      setIsVisible(false);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(true);
    setIsVisible(true);
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
    setIsVisible(false);
  };

  const handleTouchStart = () => {
    // For mobile devices, show on touch
    handleMouseEnter();
  };

  const handleTouchEnd = () => {
    // Hide after a delay on mobile
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  const proficiencyStyle =
    PROFICIENCY_STYLES[skill.proficiency as keyof typeof PROFICIENCY_STYLES] ||
    PROFICIENCY_STYLES.beginner;

  const hoverCard = (
    <AnimatePresence>
      {isVisible && mounted && (
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`fixed z-[99999] ${
            isExpanded ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            left: position.x,
            top: position.y,
            minWidth: "340px",
            maxWidth: "min(400px, calc(100vw - 128px))",
            width: "auto",
            maxHeight: isExpanded ? "70vh" : "500px",
            overflowY: isExpanded ? "auto" : "hidden",
            position: "fixed",
            zIndex: 99999,
          }}
        >
          <div
            className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md rounded-2xl p-8 shadow-organic-2xl border border-white/30 w-full relative overflow-hidden"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Scroll fade indicator for expanded state */}
            {isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent pointer-events-none z-10"></div>
            )}
            {/* Click tip in top right */}
            {!isExpanded && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-brand-primary/10 text-brand-primary text-xs px-2 py-1 rounded-full border border-brand-primary/20 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                  Click to expand
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={skill.logo}
                alt={`${skill.name} logo`}
                className="w-10 h-10 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-brand-text mb-2">
                  {skill.name}
                </h3>
                <div
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${proficiencyStyle}`}
                >
                  {skill.proficiency.charAt(0).toUpperCase() +
                    skill.proficiency.slice(1)}
                </div>
              </div>
              {isExpanded && (
                <button
                  onClick={handleCloseExpanded}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close expanded view"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-base text-brand-text-light mb-6 leading-relaxed break-words">
              {skill.description}
            </p>

            {/* Project Usage */}
            {skill.usage.length > 0 && (
              <div className="space-y-4">
                {skill.usage
                  .slice(0, isExpanded ? skill.usage.length : 2)
                  .map((usage, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-brand-beige/50 to-brand-beige-light/50 rounded-lg p-5 border border-brand-secondary/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-medium text-brand-text mb-3 break-words">
                            {usage.projectTitle}
                          </h5>
                          <p className="text-sm text-brand-text-light leading-relaxed break-words">
                            {usage.usage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {!isExpanded && skill.usage.length > 2 && (
                  <div className="text-center py-2">
                    <div className="text-2xl text-brand-text-light">...</div>
                    <div className="text-xs text-brand-text-light mt-1">
                      Click skill badge to view all {skill.usage.length}{" "}
                      projects
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scroll indicator for expanded state */}
            {isExpanded && (
              <div className="absolute bottom-4 right-4 pointer-events-none">
                <div className="bg-black/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  Scroll
                </div>
              </div>
            )}

            {/* Subtle connection indicator */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: arrowPosition.x - 2,
                top: arrowPosition.y - 2,
                width: "4px",
                height: "4px",
                background: "rgba(0,0,0,0.1)",
                borderRadius: "50%",
                boxShadow: "0 0 4px rgba(0,0,0,0.1)",
              }}
            ></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTriggerClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={className}
      >
        {children}
      </div>
      {mounted && createPortal(hoverCard, document.body)}
    </>
  );
}
