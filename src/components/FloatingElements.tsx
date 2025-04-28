import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  scale?: number;
  className?: string;
  x?: number;
  y?: number;
}

export const FloatingElement = ({
  children,
  duration = 3,
  delay = 0,
  scale = 1.05,
  className = '',
  x = 5,
  y = 5
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [0, y, 0],
        x: [0, x, 0],
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
