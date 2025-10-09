"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
  staticText?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
}

export default function Typewriter({
  words,
  staticText = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  className = "",
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(
      () => {
        if (isPaused) {
          // Wait before starting to delete
          setIsPaused(false);
          setIsDeleting(true);
          return;
        }

        if (isDeleting) {
          // Deleting characters
          if (currentText === "") {
            // Done deleting, move to next word
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          } else {
            // Delete one character
            setCurrentText(currentText.slice(0, -1));
          }
        } else {
          // Typing characters
          if (currentText === currentWord) {
            // Done typing, pause before deleting
            setIsPaused(true);
          } else {
            // Type one character
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          }
        }
      },
      isPaused ? delayBetweenWords : isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentWordIndex,
    isDeleting,
    isPaused,
    words,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
  ]);

  return (
    <span className={className}>
      {staticText}
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
