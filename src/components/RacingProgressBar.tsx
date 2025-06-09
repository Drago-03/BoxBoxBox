import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

// F1 Circuit sections
const CIRCUIT_SECTIONS = [
  'Sector 1',
  'DRS Zone',
  'Sector 2',
  'Chicane',
  'Sector 3'
];

const RacingProgressBar: React.FC = () => {
  const { progress } = useLoading();
  const controls = useAnimation();
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize dot refs array
  useEffect(() => {
    dotRefs.current = Array(5).fill(null);
  }, []);
  
  // Update progress bar width based on loading progress
  useEffect(() => {
    controls.start({ 
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    });
  }, [progress, controls]);
  
  // Create animated dots that follow the progress bar
  useEffect(() => {
    // Animate each dot with a slight delay
    dotRefs.current.forEach((dot, index) => {
      if (dot) {
        const delay = index * 0.1;
        const animate = () => {
          dot.style.opacity = '1';
          dot.style.transform = `translateX(${progress * 3}px)`;
          
          // Create trailing effect
          setTimeout(() => {
            if (dot) {
              dot.style.opacity = '0.5';
            }
          }, 200);
        };
        
        setTimeout(animate, delay * 1000);
      }
    });
  }, [progress]);
  
  // Calculate current track section
  const currentSection = Math.min(
    Math.floor(progress / 20),
    CIRCUIT_SECTIONS.length - 1
  );
  
  return (
    <div className="racing-progress-container w-full max-w-md mx-auto mt-8 px-4">
      {/* Progress details */}
      <div className="flex justify-between items-center mb-2">
        <motion.div 
          className="text-left text-sm font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span 
            className="text-xs uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-sm"
            animate={{ 
              backgroundColor: currentSection === 1 ? '#3B82F6' : '#DC2626' // Blue for DRS zone
            }}
          >
            {CIRCUIT_SECTIONS[currentSection]}
          </motion.span>
          <motion.div
            className="mt-1 text-xs text-gray-400 flex items-center"
          >
            {progress >= 100 ? (
              <span className="text-green-500">FORMATION LAP COMPLETE</span>
            ) : (
              <>
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full mr-1"
                  animate={{
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                />
                <span>Lap {Math.floor(progress / 10) + 1}/10</span>
              </>
            )}
          </motion.div>
        </motion.div>
        
        <div className="text-right">
          <span className="text-xl font-bold text-red-500">{Math.round(progress)}%</span>
          <div className="text-xs text-gray-400">
            {progress < 100 ? 'Loading assets...' : 'Ready to race'}
          </div>
        </div>
      </div>
      
      {/* Track with F1-style sections */}
      <div className="h-8 bg-gray-800 rounded-lg overflow-hidden relative border border-gray-700">
        {/* Track markings */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="h-full flex-1 relative border-r border-gray-600 last:border-r-0"
            >
              {/* Section markers */}
              <div className="absolute top-0 left-0 w-full flex justify-center">
                <div className="text-[8px] text-gray-500 bg-gray-800 px-1 rounded-b-sm">
                  {CIRCUIT_SECTIONS[i]}
                </div>
              </div>
              
              {/* Racing line */}
              <motion.div
                className="absolute top-1/2 h-0.5 w-full bg-blue-500 opacity-30"
                animate={{
                  y: [-1, 1, -1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
              />
              
              {/* Kerbs at section boundaries */}
              {i < 4 && (
                <div className="absolute right-0 inset-y-0 w-2 flex flex-col">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div 
                      key={j} 
                      className={`flex-1 ${j % 2 === 0 ? 'bg-red-500' : 'bg-white'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Animated progress bar */}
        <motion.div 
          className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF4500] rounded-l-lg relative z-10"
          initial={{ width: '0%' }}
          animate={controls}
        >
          {/* Racing line dots */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                ref={el => dotRefs.current[i] = el}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 transition-all duration-300"
                style={{ left: `${i * 20}%` }}
              />
            ))}
          </div>
          
          {/* Leading glow effect */}
          <div className="absolute right-0 top-0 h-full w-4 bg-white opacity-60 blur-sm" />
          
          {/* Animated F1 car icon at progress point */}
          <motion.div 
            className="absolute top-1/2 right-0 -translate-y-1/2 transform -translate-x-1/2"
            animate={{
              y: ['-50%', '-60%', '-50%'],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {/* F1 car top-down view */}
            <div className="w-8 h-3 relative">
              {/* Car body */}
              <div className="absolute inset-0 bg-red-600 rounded-md transform scale-x-75"></div>
              
              {/* Front wing */}
              <div className="absolute top-0 -left-1 h-full w-1.5 bg-gray-800 rounded-l-sm"></div>
              
              {/* Rear wing */}
              <div className="absolute top-0 -right-1 h-full w-1 bg-gray-800"></div>
              
              {/* Cockpit */}
              <div className="absolute top-1/4 left-1/2 h-1/2 w-1/4 bg-black rounded-sm transform -translate-x-1/2"></div>
              
              {/* Wheels */}
              <div className="absolute -top-1 left-1/4 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute -bottom-1 left-1/4 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute -top-1 right-1/4 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute -bottom-1 right-1/4 w-1 h-1 bg-black rounded-full"></div>
              
              {/* DRS animation when in DRS zone */}
              {currentSection === 1 && (
                <motion.div
                  className="absolute -right-1.5 top-0 h-full w-0.5 bg-blue-500"
                  animate={{
                    opacity: [0, 1, 0],
                    scaleY: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity
                  }}
                />
              )}
            </div>
            
            {/* Speed blur effect */}
            <motion.div
              className="absolute top-1/2 right-0 h-0.5 w-12 bg-gradient-to-l from-transparent to-red-500 -translate-y-1/2"
              animate={{
                opacity: [0.7, 0.4, 0.7],
                width: [8, 12, 8]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Start/Finish indicators */}
      <div className="flex justify-between mt-2">
        <div className="text-xs font-bold bg-white text-black px-2 py-0.5 rounded-sm">
          START
        </div>
        <div className="text-xs font-bold bg-gray-800 text-white border border-white px-2 py-0.5 rounded-sm">
          <motion.div 
            animate={{
              opacity: progress >= 100 ? [1, 0.5, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: progress >= 100 ? Infinity : 0
            }}
          >
            FINISH
          </motion.div>
        </div>
      </div>
      
      {/* Racing flag animation at completion */}
      {progress >= 100 && (
        <motion.div 
          className="absolute -right-4 top-1/2 -translate-y-1/2"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-6 h-10 relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-5 gap-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Tire wear indicator */}
      {progress > 20 && (
        <div className="mt-2 w-full flex items-center justify-end">
          <div className="text-xs text-gray-400 mr-2">Tire wear:</div>
          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full"
              style={{
                width: `${100 - progress * 0.4}%`,
                backgroundColor: progress < 50 
                  ? '#10B981' // green
                  : progress < 80 
                    ? '#F59E0B' // yellow
                    : '#EF4444' // red
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RacingProgressBar; 