

"use client";

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  distance?: number;
}

export const AnimatedSection = ({ 
  children, 
  delay = 0.2,
  direction = 'up',
  className = '',
  distance = 100 // More pronounced movement
}: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false so animations can repeat when scrolling
    threshold: 0.1
  });

  // Set initial animation states based on direction
  const getInitialState = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  const getAnimateState = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  useEffect(() => {
    if (inView) {
      controls.start(getAnimateState());
    } else {
      controls.start(getInitialState()); // Reset animation when out of view
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={controls}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring", 
        stiffness: 50 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};