import React, { useRef, useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

// Senna quotes - minimal collection for better performance
const SENNA_QUOTES = [
  "If you no longer go for a gap that exists, you're no longer a racing driver.",
  "I am not designed to come second or third. I am designed to win.",
  "Being second is to be the first of the ones who lose."
];

const LoadingScreen: React.FC = () => {
  const { isLoading, progress, hasInteracted, setHasInteracted, completeLoading } = useLoading();
  const [currentQuote, setCurrentQuote] = useState(SENNA_QUOTES[0]);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Simple quote rotation without animations
  useEffect(() => {
    if (!isLoading) return;
    
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * SENNA_QUOTES.length);
      setCurrentQuote(SENNA_QUOTES[randomIndex]);
    }, 5000);
    
    return () => clearInterval(quoteInterval);
  }, [isLoading]);

  // Handle start button click
  const handleStart = () => {
    setHasInteracted(true);
    setTimeout(completeLoading, 800);
  };

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto px-4 text-center">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-600 tracking-wider">BOXBOXBOX</h1>
          <p className="text-gray-400 text-sm">F1 PLATFORM</p>
        </div>
        
        {/* Senna Helmet - Static with better styling */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent rounded-full blur-xl"></div>
          <img 
            src="/assets/images/senna_helmet.png" 
            alt="Ayrton Senna's Helmet" 
            className="w-56 h-56 object-contain relative z-10"
            loading="eager"
          />
        </div>
        
        {/* Quote Display with better styling */}
        <div className="mb-12 text-center">
          <p className="text-white text-xl italic font-light">
            "{currentQuote}"
          </p>
          <p className="text-red-500 text-sm mt-2 font-semibold">
            - Ayrton Senna
          </p>
        </div>
        
        {/* Clean Progress Bar */}
        <div className="w-full mb-8">
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 loading-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>INITIALIZING</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Start Button - Better styling */}
        {progress >= 100 && (
          <button
            ref={startButtonRef}
            className="px-10 py-3 bg-red-600 text-white font-bold rounded-md
                     hover:bg-red-700 transition-colors duration-200 uppercase tracking-wider"
            onClick={handleStart}
          >
            Start Racing
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen; 