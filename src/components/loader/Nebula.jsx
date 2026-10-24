import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function Nebula() {
  const nebulaGroupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y = t * 0.012;
      nebulaGroupRef.current.rotation.x = Math.sin(t * 0.05) * 0.04;
    }
  });

  return (
    <group ref={nebulaGroupRef}>
      {/* Soft Gold Drift Cloud 1 */}
      <mesh position={[-6, 3, -12]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[18, 14]} />
        <meshBasicMaterial
          color="#e8b86d"
          transparent
          opacity={0.065}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Electric Cyan Drift Cloud 2 */}
      <mesh position={[8, -4, -14]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central Warm Horizon Cloud */}
      <mesh position={[0, -2, -8]}>
        <planeGeometry args={[24, 8]} />
        <meshBasicMaterial
          color="#e8b86d"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fine Floating Cosmic Dust Particles */}
      <Sparkles
        count={120}
        scale={[28, 18, 20]}
        size={2.2}
        speed={0.4}
        color="#e8b86d"
        opacity={0.45}
      />
      <Sparkles
        count={90}
        scale={[24, 16, 18]}
        size={1.8}
        speed={0.3}
        color="#00d4ff"
        opacity={0.4}
      />
    </group>
  );
}

export default Nebula;
