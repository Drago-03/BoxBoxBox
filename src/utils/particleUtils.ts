import * as THREE from 'three';

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
}

export const createParticle = (
  position: THREE.Vector3,
  color: THREE.Color = new THREE.Color('#FF0000'),
  size: number = Math.random() * 0.5 + 0.5,
  life: number = Math.random() * 1 + 1
): Particle => {
  return {
    position: position.clone(),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    ),
    acceleration: new THREE.Vector3(0, -0.01, 0),
    color,
    size,
    life,
    maxLife: life,
  };
};

export const updateParticle = (particle: Particle, delta: number): boolean => {
  particle.velocity.add(particle.acceleration);
  particle.position.add(particle.velocity);
  particle.life -= delta;
  
  // Return true if particle is still alive
  return particle.life > 0;
};

export const createSpeedParticles = (count: number, origin: THREE.Vector3, radius: number = 5): Particle[] => {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    const x = origin.x + radius * Math.sin(phi) * Math.cos(theta);
    const y = origin.y + radius * Math.sin(phi) * Math.sin(theta);
    const z = origin.z + radius * Math.cos(phi);
    
    const position = new THREE.Vector3(x, y, z);
    const color = new THREE.Color().setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.6); // Red-orange hues
    
    particles.push(createParticle(position, color));
  }
  
  return particles;
}; 