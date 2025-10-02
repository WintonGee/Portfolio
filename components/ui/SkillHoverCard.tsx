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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2 - 200,
        y: rect.bottom + 8,
      });
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const proficiencyStyle =
    PROFICIENCY_STYLES[skill.proficiency as keyof typeof PROFICIENCY_STYLES] ||
    PROFICIENCY_STYLES.beginner;

  const hoverCard = (
    <AnimatePresence>
      {isVisible && mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-[99999] pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            minWidth: "320px",
            maxWidth: "min(400px, 90vw)",
          }}
        >
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md rounded-2xl p-6 shadow-organic-2xl border border-white/30 w-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
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
            <p className="text-base text-brand-text-light mb-5 leading-relaxed">
              {skill.description}
            </p>

            {/* Project Usage */}
            {skill.usage.length > 0 && (
              <div className="space-y-3">
                {skill.usage.map((usage, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-brand-beige/50 to-brand-beige-light/50 rounded-lg p-4 border border-brand-secondary/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h5 className="text-base font-medium text-brand-text mb-2">
                          {usage.projectTitle}
                        </h5>
                        <p className="text-sm text-brand-text-light leading-relaxed">
                          {usage.usage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Arrow pointer */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-l border-t border-white/30"></div>
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
        className={className}
      >
        {children}
      </div>
      {mounted && createPortal(hoverCard, document.body)}
    </>
  );
}
