"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

const SPRING_CONFIG = { type: "spring" as const, stiffness: 150, damping: 15, mass: 0.1 };

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  download?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  download,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const { ref, handleMouseMove, handleMouseLeave, animateProps } = useMagneticEffect();

  const baseClasses =
    "font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform";

  const sizeClasses = {
    sm: "px-3 sm:px-4 py-2 text-sm",
    md: "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base",
    lg: "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg",
  };

  const variantClasses = {
    primary:
      "group relative bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-brand-beige hover:shadow-organic-lg hover:shadow-brand-primary/25",
    secondary:
      "group px-8 py-4 border-2 border-brand-secondary text-brand-text hover:bg-brand-primary hover:text-brand-beige hover:shadow-organic",
    outline:
      "px-6 py-2 border-2 border-brand-secondary text-brand-text hover:bg-brand-primary hover:text-brand-beige font-medium rounded-lg hover:shadow-organic",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
      )}
    </>
  );

  const MotionComponent = href ? motion.a : motion.button;
  const componentProps = href
    ? {
        href,
        download,
        target: href.startsWith("mailto:") ? undefined : "_blank",
        rel: href.startsWith("mailto:") ? undefined : "noopener noreferrer",
      }
    : {
        onClick,
        disabled,
        type,
      };

  return (
    <MotionComponent
      ref={ref as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={animateProps}
      transition={SPRING_CONFIG}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={classes}
      {...componentProps}
    >
      {buttonContent}
    </MotionComponent>
  );
}
