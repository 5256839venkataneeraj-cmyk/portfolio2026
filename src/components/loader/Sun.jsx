import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function Sun({ progress = 0 }) {
  const chipRef = useRef();
  const innerCoreRef = useRef();
  const raysRef = useRef();
  const cyanRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle gentle float and slow axial rotation
    if (chipRef.current) {
      chipRef.current.rotation.y = t * 0.4;
      chipRef.current.rotation.x = Math.sin(t * 0.3) * 0.12;
      chipRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }

    // Breathing pulse for the glowing gold/amber core
    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(t * 2.4) * 0.18;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
      if (innerCoreRef.current.material) {
        innerCoreRef.current.material.emissiveIntensity = 2.2 + Math.sin(t * 3.0) * 0.8;
      }
    }

    // Cyan inner glow rotation
    if (cyanRingRef.current) {
      cyanRingRef.current.rotation.z = -t * 0.5;
    }

    // Volumetric additive light rays
    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group>
      {/* Central Omnidirectional Gold Point Light */}
      <pointLight color="#e8b86d" intensity={4.5} distance={28} decay={2} />
      <pointLight color="#00d4ff" intensity={1.8} distance={12} decay={2} />

      {/* Main 3D Rounded Chip (Sun) */}
      <group ref={chipRef}>
        {/* Outer Dark Metallic Silicon Package */}
        <RoundedBox args={[1.5, 1.5, 0.32]} radius={0.16} smoothness={4}>
          <meshStandardMaterial
            color="#090d14"
            roughness={0.25}
            metalness={0.92}
            emissive="#121824"
            emissiveIntensity={0.4}
          />
        </RoundedBox>

        {/* Emissive Gold/Amber Silicon Die Core */}
        <RoundedBox ref={innerCoreRef} args={[1.05, 1.05, 0.35]} radius={0.1} smoothness={3}>
          <meshStandardMaterial
            color="#e8b86d"
            emissive="#e8b86d"
            emissiveIntensity={2.5}
            roughness={0.15}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Cyan Inner Glow & Circuit Frame */}
        <group ref={cyanRingRef}>
          <mesh position={[0, 0, 0.18]}>
            <ringGeometry args={[0.56, 0.62, 32]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0, -0.18]}>
            <ringGeometry args={[0.56, 0.62, 32]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Micro-Pin Contacts around perimeter */}
        {[-0.6, -0.2, 0.2, 0.6].map((offset, i) => (
          <React.Fragment key={i}>
            <mesh position={[offset, 0.82, 0]}>
              <boxGeometry args={[0.08, 0.14, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
            <mesh position={[offset, -0.82, 0]}>
              <boxGeometry args={[0.08, 0.14, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
            <mesh position={[0.82, offset, 0]}>
              <boxGeometry args={[0.14, 0.08, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
            <mesh position={[-0.82, offset, 0]}>
              <boxGeometry args={[0.14, 0.08, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Volumetric Light Rays (Additive Sprite Planes) */}
      <group ref={raysRef}>
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, idx) => (
          <mesh key={idx} rotation={[0, 0, rot]}>
            <planeGeometry args={[7.5, 0.65]} />
            <meshBasicMaterial
              color="#e8b86d"
              transparent
              opacity={0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Cyan & Gold Halo Disc */}
      <mesh>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial
          color="#e8b86d"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default Sun;
