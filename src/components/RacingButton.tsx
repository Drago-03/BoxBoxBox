import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RacingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: 'red' | 'blue' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  soundEffect?: boolean;
  disabled?: boolean;
}

const RacingButton: React.FC<RacingButtonProps> = ({
  children,
  onClick,
  className = '',
  color = 'red',
  size = 'md',
  soundEffect = true,
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);
  
  // Color mapping
  const colors = {
    red: {
      bg: 'bg-[#FF0000]',
      hover: 'hover:bg-[#FF2200]',
      shadow: 'shadow-[0_4px_0_#990000]',
      ripple: 'rgba(255, 0, 0, 0.7)'
    },
    blue: {
      bg: 'bg-[#0066CC]',
      hover: 'hover:bg-[#0077EE]',
      shadow: 'shadow-[0_4px_0_#003399]',
      ripple: 'rgba(0, 102, 204, 0.7)'
    },
    green: {
      bg: 'bg-[#00CC66]',
      hover: 'hover:bg-[#00DD77]',
      shadow: 'shadow-[0_4px_0_#009944]',
      ripple: 'rgba(0, 204, 102, 0.7)'
    },
    yellow: {
      bg: 'bg-[#FFCC00]',
      hover: 'hover:bg-[#FFDD22]',
      shadow: 'shadow-[0_4px_0_#CC9900]',
      ripple: 'rgba(255, 204, 0, 0.7)'
    }
  };
  
  // Size mapping
  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4'
  };
  
  // Handle click with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    if (!buttonRef.current) return;
    
    // Calculate click position relative to button
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create ripple
    const rippleId = rippleIdRef.current++;
    setRipples(prevRipples => [...prevRipples, { id: rippleId, x, y }]);
    
    // Play sound effect if enabled
    if (soundEffect) {
      const audio = new Audio('/sounds/button-click.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.warn('Audio play failed', e));
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prevRipples => prevRipples.filter(r => r.id !== rippleId));
    }, 1000);
    
    // Call the onClick handler
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick?.();
  };
  
  // Track mouse position for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    
    setCoords({ x, y });
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-md font-bold text-white 
        transform transition-all duration-150 
        ${colors[color].bg} 
        ${colors[color].hover} 
        ${colors[color].shadow} 
        ${sizes[size]} 
        ${isPressed ? 'translate-y-1 shadow-none' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: -coords.y * 0.5,
        rotateY: coords.x * 0.5,
        z: isPressed ? -10 : 0
      }}
      whileHover={{
        scale: disabled ? 1 : 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: disabled ? 1 : 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: colors[color].ripple,
            translateX: '-50%',
            translateY: '-50%',
            zIndex: 10
          }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ 
            width: 400, 
            height: 400, 
            opacity: 0,
            z: 20
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      
      {/* 3D depth effect */}
      <motion.div
        className="absolute inset-0 rounded-md bg-black/10"
        style={{ zIndex: 5 }}
        animate={{
          rotateX: coords.y * 2,
          rotateY: -coords.x * 2,
        }}
      />
      
      {/* Button text */}
      <motion.span 
        className="relative z-20"
        animate={{
          z: 30,
          textShadow: isPressed ? '0px 0px 0px rgba(0,0,0,0.5)' : '0px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default RacingButton; 