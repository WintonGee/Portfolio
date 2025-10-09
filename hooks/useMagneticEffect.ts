import { useRef, useState } from "react";

const MAGNETIC_STRENGTH = 0.15;

export function useMagneticEffect() {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const animateProps = {
    x: position.x * MAGNETIC_STRENGTH,
    y: position.y * MAGNETIC_STRENGTH,
  };

  return { ref, handleMouseMove, handleMouseLeave, animateProps };
}
