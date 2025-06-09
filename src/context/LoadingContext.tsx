import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextProps {
  isLoading: boolean;
  progress: number;
  setProgress: (progress: number) => void;
  completeLoading: () => void;
  hasInteracted: boolean;
  setHasInteracted: (value: boolean) => void;
  hasError: boolean;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Faster, optimized loading simulation
  useEffect(() => {
    // Faster loading with fewer steps
    const totalAssets = 5; 
    let loadedAssets = 0;
    
    const loadNextAsset = () => {
      if (loadedAssets < totalAssets) {
        // Faster loading time
        setTimeout(() => {
          loadedAssets++;
          setProgress((loadedAssets / totalAssets) * 100);
          loadNextAsset();
        }, 150); // Fixed faster interval
      }
    };
    
    loadNextAsset();
    
    // Shorter fallback timer
    const fallbackTimer = setTimeout(() => {
      setProgress(100);
    }, 3000); // 3 seconds max loading time
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Auto-complete loading when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && hasInteracted) {
      // Reduced delay
      const timer = setTimeout(() => completeLoading(), 200);
      return () => clearTimeout(timer);
    }
  }, [progress, hasInteracted]);

  const completeLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        progress, 
        setProgress, 
        completeLoading,
        hasInteracted,
        setHasInteracted,
        hasError
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}; 