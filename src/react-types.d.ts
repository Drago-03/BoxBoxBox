import * as React from 'react';

// Fix for React JSX intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      mesh: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      boxGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      meshStandardMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      cylinderGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      primitive: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      ambientLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      directionalLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      spotLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      points: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
      color: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & any;
    }
  }

  // Web Speech API
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Fix for modules without type declarations
declare module '@react-three/fiber' {
  export const Canvas: React.FC<any>;
  export function useFrame(callback: (state: any) => void): void;
  export function useLoader(loader: any, url: string, onProgress?: (xhr: any) => void): any;
}

declare module '@react-three/drei' {
  export const OrbitControls: React.FC<any>;
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export class GLTFLoader {
    load(
      url: string,
      onLoad?: (gltf: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: any) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}

// Ensure TypeScript understands motion components from framer-motion
declare module 'framer-motion' {
  export const motion: {
    [key: string]: any;
  };
  export function useAnimation(): any;
  export function useScroll(): { scrollYProgress: any };
  export function useTransform(value: any, input: any[], output: any[]): any;
  export function useTransform(value: any, mapFn: (v: any) => any): any;
  export function useMotionValue(initialValue: number): any;
  export const AnimatePresence: React.FC<any>;
}

// Define use-sound types
declare module 'use-sound' {
  export default function useSound(
    src: string,
    options?: {
      volume?: number;
      playbackRate?: number;
      interrupt?: boolean;
      soundEnabled?: boolean;
      sprite?: Record<string, [number, number]>;
      onend?: () => void;
    }
  ): [() => void, { stop: () => void; isPlaying: boolean }];
} 