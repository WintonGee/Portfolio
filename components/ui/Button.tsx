"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
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
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
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

  if (href) {
    return (
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className={classes}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={classes}
    >
      {buttonContent}
    </motion.button>
  );
}
