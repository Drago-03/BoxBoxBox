import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';

interface CarVisualizationProps {
  selectedComponent: string;
}

// Simple F1 car geometry using Three.js primitives
const F1Car: React.FC<{ selectedComponent: string }> = ({ selectedComponent }) => {
  const carRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (carRef.current) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const getComponentColor = (componentName: string) => {
    if (selectedComponent === componentName) return '#22c55e'; // Green for selected
    if (hovered === componentName) return '#3b82f6'; // Blue for hovered
    return '#6b7280'; // Gray for default
  };

  return (
    <group ref={carRef}>
      {/* Main chassis */}
      <mesh
        position={[0, 0, 0]}
        onPointerEnter={() => setHovered('chassis')}
        onPointerLeave={() => setHovered(null)}
      >
        <boxGeometry args={[4, 0.3, 1]} />
        <meshStandardMaterial color={getComponentColor('chassis')} />
      </mesh>

      {/* Nose cone */}
      <mesh
        position={[2.5, 0, 0]}
        onPointerEnter={() => setHovered('aerodynamics')}
        onPointerLeave={() => setHovered(null)}
      >
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color={getComponentColor('aerodynamics')} />
      </mesh>

      {/* Front wing */}
      <mesh
        position={[3, -0.2, 0]}
        onPointerEnter={() => setHovered('aerodynamics')}
        onPointerLeave={() => setHovered(null)}
      >
        <boxGeometry args={[0.2, 0.1, 2]} />
        <meshStandardMaterial color={getComponentColor('aerodynamics')} />
      </mesh>

      {/* Rear wing */}
      <mesh
        position={[-2, 0.5, 0]}
        onPointerEnter={() => setHovered('drs')}
        onPointerLeave={() => setHovered(null)}
      >
        <boxGeometry args={[0.3, 0.8, 1.5]} />
        <meshStandardMaterial color={getComponentColor('drs')} />
      </mesh>

      {/* Halo */}
      <mesh
        position={[0.5, 0.5, 0]}
        onPointerEnter={() => setHovered('halo')}
        onPointerLeave={() => setHovered(null)}
      >
        <torusGeometry args={[0.4, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color={getComponentColor('halo')} />
      </mesh>

      {/* Wheels */}
      {[
        [-1.5, -0.3, 0.8],
        [-1.5, -0.3, -0.8],
        [1.5, -0.3, 0.8],
        [1.5, -0.3, -0.8]
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Floor */}
      <mesh
        position={[0, -0.4, 0]}
        onPointerEnter={() => setHovered('floor')}
        onPointerLeave={() => setHovered(null)}
      >
        <boxGeometry args={[4, 0.05, 1.2]} />
        <meshStandardMaterial color={getComponentColor('floor')} />
      </mesh>
    </group>
  );
};

export const CarVisualization: React.FC<CarVisualizationProps> = ({ selectedComponent }) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
            autoRotate ? 'bg-green-600/20 text-green-400' : 'bg-gray-800/50 text-gray-400'
          }`}
          title="Toggle auto-rotation"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetView}
          className="p-2 bg-gray-800/50 text-gray-400 rounded-lg backdrop-blur-sm hover:text-white transition-colors"
          title="Reset view"
        >
          <Move3D className="w-4 h-4" />
        </motion.button>
      </div>

      {/* 3D Canvas */}
      <div className="h-96 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden">
        <Canvas>
          <PerspectiveCamera makeDefault position={[8, 4, 8]} />
          
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <F1Car selectedComponent={selectedComponent} />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={4}
            maxDistance={20}
          />
          
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <div className="text-xs text-gray-400 text-center">
          <div className="flex items-center justify-center space-x-4">
            <span>🖱️ Click and drag to rotate</span>
            <span>⚲ Scroll to zoom</span>
            <span>✋ Hover over parts to highlight</span>
          </div>
        </div>
      </div>
    </div>
  );
};