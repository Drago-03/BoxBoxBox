import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

// Main F1 Logo component
const F1Logo: React.FC<{
  isHeaderLogo?: boolean;
}> = ({ isHeaderLogo = false }) => {
  const { isLoading, hasInteracted } = useLoading();
  
  // Animation variants for the logo container
  const containerVariants = {
    loading: { 
      scale: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" } 
    },
    header: { 
      scale: 0.5, 
      y: -50,
      transition: { 
        duration: 1.2, 
        ease: "easeInOut",
        delay: 0.3
      } 
    }
  };
  
  return (
    <motion.div
      className={`f1-logo-container ${isHeaderLogo ? 'header-logo' : ''}`}
      initial="loading"
      animate={!isLoading && hasInteracted ? "header" : "loading"}
      variants={containerVariants}
    >
      <div className="text-logo">
        <motion.h1 
          className="text-5xl font-bold text-[#FF0000] drop-shadow-[0_0_10px_rgba(255,0,0,0.7)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, delay: 0.2 } 
          }}
        >
          BoxBoxBox
        </motion.h1>
      </div>
      
      <motion.div 
        className="w-32 h-32 relative mt-4"
        initial={{ rotateY: 0 }}
        animate={{ 
          rotateY: isHeaderLogo ? 180 : 0,
          transition: { duration: 1, delay: 0.5 } 
        }}
        style={{ perspective: 1000 }}
      >
        {/* Stylized F1 Car Logo */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-28 h-14">
            {/* Car Body */}
            <motion.div 
              className="absolute w-20 h-4 bg-red-600 rounded-md left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.05, 1],
                translateY: [0, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Front Wing */}
            <motion.div 
              className="absolute w-6 h-1.5 bg-red-600 rounded-sm left-0 top-1/2 -translate-y-1/2"
              animate={{
                scaleX: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Rear Wing */}
            <motion.div 
              className="absolute w-2.5 h-5 bg-red-600 right-0 top-1/2 -translate-y-1/2"
              animate={{
                scaleY: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Cockpit */}
            <div className="absolute w-6 h-3 bg-black rounded-t-md left-1/2 top-0 -translate-x-1/2" />
            
            {/* Wheels */}
            <div className="absolute w-4 h-4 bg-gray-900 rounded-full border border-gray-400 left-4 bottom-0" />
            <div className="absolute w-4 h-4 bg-gray-900 rounded-full border border-gray-400 right-7 bottom-0" />
            
            {/* Speed Lines */}
            <motion.div 
              className="absolute h-0.5 bg-white left-0 w-full top-2"
              animate={{
                scaleX: [0, 1],
                opacity: [0, 0.7, 0],
                x: ['-50%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div 
              className="absolute h-0.5 bg-white left-0 w-full bottom-2"
              animate={{
                scaleX: [0, 1],
                opacity: [0, 0.7, 0],
                x: ['-50%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default F1Logo; 