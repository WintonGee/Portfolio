"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isHoveringCardRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const proficiencyStyle =
    PROFICIENCY_STYLES[skill.proficiency as keyof typeof PROFICIENCY_STYLES] ||
    PROFICIENCY_STYLES.beginner;

  // Setup and cleanup
  useEffect(() => {
    setMounted(true);
    return () => {
      setIsOpen(false);
      isHoveringCardRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Timeout management
  const clearCloseTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Hover state handlers
  const handleOpenChange = (open: boolean) => {
    clearCloseTimeout();
    if (open) {
      setIsOpen(true);
    } else if (!isHoveringCardRef.current) {
      setIsOpen(false);
    }
  };

  const handleCardMouseEnter = () => {
    clearCloseTimeout();
    isHoveringCardRef.current = true;
  };

  const handleCardMouseLeave = () => {
    isHoveringCardRef.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringCardRef.current) setIsOpen(false);
    }, 150);
  };

  // Card content
  const cardContent = (
    <AnimatePresence>
      {isOpen && mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-[99999] w-[480px] max-w-[calc(100vw-48px)] min-w-[400px] top-[80px] left-[64px]"
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md rounded-2xl p-8 pb-12 shadow-organic-2xl border border-white/30 w-full relative overflow-hidden max-h-[600px] overflow-y-auto">
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
            </div>

            {/* Description */}
            <p className="text-base text-brand-text-light mb-6 leading-relaxed break-words">
              {skill.description}
            </p>

            {/* Project Usage */}
            {skill.usage.length > 0 && (
              <div className="space-y-4 mb-4">
                {skill.usage.map((usage, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-brand-beige/50 to-brand-beige-light/50 rounded-lg p-6 pb-7 border border-brand-secondary/20"
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
              </div>
            )}

            {/* Scroll fade indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-10"></div>

            {/* Connection indicator */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-brand-primary/30 rounded-full pointer-events-none"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <HoverCard.Root
        openDelay={200}
        closeDelay={100}
        onOpenChange={handleOpenChange}
      >
        <HoverCard.Trigger asChild>
          <div className={className}>{children}</div>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content style={{ display: "none" }}>
            <div></div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
      {mounted && createPortal(cardContent, document.body)}
    </>
  );
}
