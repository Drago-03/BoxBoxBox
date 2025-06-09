import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createSpeedParticles, updateParticle } from '../utils/particleUtils';

const ParticleEffects = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleSystemRef = useRef<{
    particles: THREE.BufferGeometry;
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    particleData: any[];
  }>({
    particles: new THREE.BufferGeometry(),
    positions: new Float32Array([]),
    colors: new Float32Array([]),
    sizes: new Float32Array([]),
    particleData: [],
  });
  
  // Initialize particles
  const COUNT = 200;
  
  // Create initial particles
  useEffect(() => {
    const system = particleSystemRef.current;
    const origin = new THREE.Vector3(0, 0, 0);
    
    // Create particle data
    system.particleData = createSpeedParticles(COUNT, origin, 5);
    
    // Initialize buffers
    system.positions = new Float32Array(COUNT * 3);
    system.colors = new Float32Array(COUNT * 3);
    system.sizes = new Float32Array(COUNT);
    
    // Initialize particle system
    updateParticleBuffers();
    
    // Set up geometry attributes
    system.particles.setAttribute('position', new THREE.BufferAttribute(system.positions, 3));
    system.particles.setAttribute('color', new THREE.BufferAttribute(system.colors, 3));
    system.particles.setAttribute('size', new THREE.BufferAttribute(system.sizes, 1));
    
    function updateParticleBuffers() {
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const particle = system.particleData[i];
        
        if (particle) {
          system.positions[i3] = particle.position.x;
          system.positions[i3 + 1] = particle.position.y;
          system.positions[i3 + 2] = particle.position.z;
          
          system.colors[i3] = particle.color.r;
          system.colors[i3 + 1] = particle.color.g;
          system.colors[i3 + 2] = particle.color.b;
          
          system.sizes[i] = particle.size * (particle.life / particle.maxLife);
        }
      }
      
      system.particles.attributes.position.needsUpdate = true;
      system.particles.attributes.color.needsUpdate = true;
      system.particles.attributes.size.needsUpdate = true;
    }
    
  }, [COUNT]);
  
  // Particle shader material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load('/textures/particle.png') }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
          if (gl_FragColor.a < 0.1) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
  }, []);
  
  // Animation loop
  useFrame(({ clock }) => {
    const system = particleSystemRef.current;
    const delta = clock.getDelta();
    
    // Update particles
    for (let i = 0; i < system.particleData.length; i++) {
      const particle = system.particleData[i];
      
      // Update particle or regenerate if expired
      if (!updateParticle(particle, delta)) {
        // Reset the particle
        const origin = new THREE.Vector3(0, 0, 0);
        const newParticles = createSpeedParticles(1, origin, 5);
        system.particleData[i] = newParticles[0];
      }
    }
    
    // Update the buffers with new positions/colors/sizes
    for (let i = 0; i < system.particleData.length; i++) {
      const i3 = i * 3;
      const particle = system.particleData[i];
      
      system.positions[i3] = particle.position.x;
      system.positions[i3 + 1] = particle.position.y;
      system.positions[i3 + 2] = particle.position.z;
      
      system.colors[i3] = particle.color.r;
      system.colors[i3 + 1] = particle.color.g;
      system.colors[i3 + 2] = particle.color.b;
      
      system.sizes[i] = particle.size * (particle.life / particle.maxLife);
    }
    
    // Update geometry attributes
    if (particlesRef.current) {
      const attributes = particlesRef.current.geometry.attributes;
      attributes.position.needsUpdate = true;
      attributes.color.needsUpdate = true;
      attributes.size.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef} geometry={particleSystemRef.current.particles} material={particleMaterial} />
  );
};

export default ParticleEffects; 