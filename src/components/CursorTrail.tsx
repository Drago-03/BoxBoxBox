import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Point {
  x: number;
  y: number;
  dx: number;
  dy: number;
  age: number;
  element: HTMLDivElement;
}

const CursorTrail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  
  // Settings
  const MAX_POINTS = 20;
  const POINT_LIFE = 1.5; // seconds
  const SPEED_THRESHOLD = 5; // minimum speed to create points
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize
    const container = containerRef.current;
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
      
      // Calculate mouse speed
      const dx = mouseRef.current.x - mouseRef.current.lastX;
      const dy = mouseRef.current.y - mouseRef.current.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Only create points if mouse is moving fast enough
      if (speed > SPEED_THRESHOLD) {
        createPoint(clientX, clientY, dx, dy);
      }
    };
    
    // Create a new point
    const createPoint = (x: number, y: number, dx: number, dy: number) => {
      // Create point element
      const pointElement = document.createElement('div');
      pointElement.className = 'cursor-trail-point';
      
      // Style based on speed
      const speed = Math.sqrt(dx * dx + dy * dy);
      const hue = gsap.utils.mapRange(5, 50, 0, 30, Math.min(speed, 50));
      const size = gsap.utils.mapRange(5, 50, 6, 15, Math.min(speed, 50));
      
      // Apply styles
      Object.assign(pointElement.style, {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
        boxShadow: `0 0 10px hsl(${hue}, 100%, 60%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: '9999',
        opacity: '0.8'
      });
      
      // Add to DOM
      container.appendChild(pointElement);
      
      // Create point object
      const point: Point = {
        x,
        y, 
        dx: dx * 0.3, // scale down velocity for effect
        dy: dy * 0.3,
        age: 0,
        element: pointElement
      };
      
      // Add to points array
      pointsRef.current.push(point);
      
      // Remove oldest point if we exceed max
      if (pointsRef.current.length > MAX_POINTS) {
        const oldest = pointsRef.current.shift();
        if (oldest && oldest.element.parentNode) {
          oldest.element.parentNode.removeChild(oldest.element);
        }
      }
    };
    
    // Animation frame handler
    const updatePoints = () => {
      const points = pointsRef.current;
      const dt = 1/60; // assume 60fps
      
      // Update each point
      for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        
        // Update age
        point.age += dt;
        
        if (point.age >= POINT_LIFE) {
          // Remove point if too old
          if (point.element.parentNode) {
            point.element.parentNode.removeChild(point.element);
          }
          points.splice(i, 1);
        } else {
          // Update position
          point.x += point.dx;
          point.y += point.dy;
          
          // Apply physics - slow down
          point.dx *= 0.95;
          point.dy *= 0.95;
          
          // Calculate opacity based on age
          const opacity = 1 - (point.age / POINT_LIFE);
          const scale = 1 - (point.age / POINT_LIFE) * 0.5;
          
          // Update styles
          gsap.set(point.element, {
            x: point.x,
            y: point.y,
            opacity: opacity,
            scale: scale
          });
        }
      }
      
      frameRef.current = requestAnimationFrame(updatePoints);
    };
    
    // Start animation
    frameRef.current = requestAnimationFrame(updatePoints);
    
    // Add mouse listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Remove all points
      pointsRef.current.forEach(point => {
        if (point.element.parentNode) {
          point.element.parentNode.removeChild(point.element);
        }
      });
      pointsRef.current = [];
    };
  }, []);
  
  return <div ref={containerRef} className="cursor-trail-container" />;
};

export default CursorTrail; 