"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface RollingBallProps {
  size?: number;
  color?: string;
  duration?: number;
  delay?: number;
  yPosition?: string;
}

export const RollingBall: React.FC<RollingBallProps> = ({
  size = 50,
  color = "#3B82F6", // Default blue color
  duration = 8,
  delay = 0,
  yPosition = "50%",
}) => {
  const controls = useAnimation();
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Get window width on initial render
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Initial width
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Start animation when window width is available
  useEffect(() => {
    if (windowWidth > 0) {
      const startAnimation = async () => {
        await controls.start({
          x: [-(size * 2), windowWidth + (size * 2)],
          rotate: [0, 360 * (windowWidth / 100)], // Rotation based on screen width
          transition: {
            duration: duration,
            ease: "linear",
            delay: delay,
            repeat: Infinity,
            repeatType: "loop"
          }
        });
      };
      
      startAnimation();
    }
  }, [windowWidth, controls, size, duration, delay]);

  return (
    <div className="absolute overflow-hidden pointer-events-none" style={{ top: yPosition, left: 0, right: 0 }}>
      <motion.div
        animate={controls}
        initial={{ x: -(size * 2) }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}80`,
        }}
      />
    </div>
  );
};

// Usage example component
export const RollingBallDemo: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#3B82F6] flex items-center justify-center">
      <h1 className="text-4xl text-white font-bold z-10">Rolling Ball Animation</h1>
      
      {/* Multiple balls with different sizes, speeds and positions */}
      <RollingBall size={40} color="#1B89A4" duration={7} yPosition="30%" />
      <RollingBall size={60} color="#1B89A4" duration={10} delay={2} yPosition="50%" />
      <RollingBall size={30} color="#1B89A4" duration={5} delay={1} yPosition="70%" />
    </div>
  );
};