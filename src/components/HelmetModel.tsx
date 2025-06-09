import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';
import { useLoading } from '../context/LoadingContext';

const HelmetModel = () => {
  const helmetRef = useRef<THREE.Group>(null);
  const { progress, setProgress } = useLoading();
  
  // Load the Senna helmet model
  // Note: You'll need to provide an actual helmet model file
  // This is a placeholder that needs to be replaced with an actual GLTF model
  const helmetPath = '/models/senna_helmet.glb';
  
  // Use try-catch as the model might not exist yet
  let gltf: unknown;
  try {
    gltf = useLoader(GLTFLoader, helmetPath, (xhr) => {
      setProgress((xhr.loaded / xhr.total) * 100);
    });
  } catch (error) {
    console.warn('Model not loaded, using placeholder');
  }
  
  // Rotation animation
  useFrame(({ clock }) => {
    if (helmetRef.current) {
      // Smooth rotation based on time
      helmetRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      
      // Add slight tilt and movement
      helmetRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      helmetRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  // yo if the model ain't loaded, we gotta make a backup helmet fr fr
  useEffect(() => {
    if (!gltf && helmetRef.current) {
      // making a basic helmet shape cuz the real one ghosted us rn
      const helmetShape = new THREE.SphereGeometry(1, 32, 32);
      const helmetDrip = new THREE.MeshStandardMaterial({ 
        color: 0xFFFF00, // that iconic Senna yellow no cap
        roughness: 0.3,
        metalness: 0.7,
      });
      
      const helmet = new THREE.Mesh(helmetShape, helmetDrip);
      
      // Add green stripe for Senna's helmet (that iconic drip fr fr)
      const stripeGeometry = new THREE.CylinderGeometry(1.01, 1.01, 0.4, 32);
      const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.rotation.x = Math.PI / 2;
      
      helmetRef.current.add(helmet);
      helmetRef.current.add(stripe);
    }
  }, [gltf]);

  return (
    <group ref={helmetRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      {gltf && typeof gltf === 'object' && 'scene' in gltf ? (
        <primitive object={(gltf as { scene: THREE.Object3D }).scene} />
      ) : null}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
    </group>
  );
};

export default HelmetModel; 