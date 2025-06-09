import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';

interface ParallaxItemProps {
  children: React.ReactNode;
  depth?: number; // 0-1, where 0 is no parallax and 1 is maximum
  className?: string;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = ({ 
  children, 
  depth = 0.5,
  className = '' 
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Calculate transforms based on mouse position and depth
  const rotateX = useTransform(mouseY, [-300, 300], [depth * 15, -depth * 15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-depth * 15, depth * 15]);
  const x = useTransform(mouseX, [-300, 300], [depth * 30, -depth * 30]);
  const y = useTransform(mouseY, [-300, 300], [depth * 30, -depth * 30]);
  const scale = useTransform(mouseY, [-300, 300], [1 + depth * 0.1, 1 - depth * 0.1]);
  
  // Update mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = (currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    // Reset position when mouse leaves
    mouseX.set(0);
    mouseY.set(0);
  };
  
  return (
    <motion.div
      className={`parallax-item relative ${className}`}
      style={{
        rotateX,
        rotateY,
        x,
        y,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        transformOrigin: 'center center'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax scroll effect
  useEffect(() => {
    if (!ref.current) return;
    
    const handleScroll = () => {
      const items = ref.current?.querySelectorAll('.parallax-item');
      if (!items) return;
      
      items.forEach((item, i) => {
        const depth = parseFloat(item.getAttribute('data-depth') || '0.5');
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportHeight = window.innerHeight;
        const distanceFromCenter = centerY - viewportHeight / 2;
        const parallaxOffset = distanceFromCenter * depth * -0.05;
        
        // Apply transform
        (item as HTMLElement).style.transform = 
          `translateY(${parallaxOffset}px) scale(${1 - Math.abs(parallaxOffset) * 0.001})`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.div 
      ref={ref}
      className={`parallax-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full blur-sm"
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5],
              opacity: [Math.random() * 0.5 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, -100]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]) 
        }}
      >
        {children}
      </motion.div>
      
      {/* Speed lines on scroll */}
      <motion.div 
        className="speed-lines absolute inset-0 pointer-events-none z-0"
        style={{ 
          opacity: useTransform(scrollYProgress, (v) => Math.abs(v - 0.5) * 2)
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-red-500/30 w-full left-0"
            style={{
              top: `${i * 10 + Math.random() * 5}%`,
              height: `${Math.random() * 2 + 1}px`,
              filter: 'blur(1px)',
              transformOrigin: 'left center'
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.7, 0],
              x: ['-100%', '100%']
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ParallaxContainer; 