import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

export function Planet({
  name = 'Skill',
  radius = 0.25,
  orbitA = 3.5, // semi-major axis
  orbitB = 2.8, // semi-minor axis
  speed = 0.5,
  tilt = [0.2, 0.1, 0],
  color = '#e8b86d',
  emissive = '#e8b86d',
  emissiveIntensity = 0.8,
  hasRing = false,
  hasMoon = false,
  startAngle = 0,
}) {
  const planetRef = useRef();
  const moonRef = useRef();
  const tracerRef = useRef();
  const orbitGroupRef = useRef();

  // Generate smooth elliptical orbit line points
  const orbitPoints = useMemo(() => {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * orbitA, 0, Math.sin(theta) * orbitB));
    }
    return points;
  }, [orbitA, orbitB]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + startAngle;

    // Elliptical orbit position
    const x = Math.cos(t) * orbitA;
    const z = Math.sin(t) * orbitB;

    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
      planetRef.current.rotation.y += 0.02;
    }

    // Tracer particle traveling along orbit slightly ahead
    if (tracerRef.current) {
      const tracerT = t + 0.12;
      tracerRef.current.position.set(Math.cos(tracerT) * orbitA, 0, Math.sin(tracerT) * orbitB);
    }

    // Orbiting moon if enabled
    if (moonRef.current && planetRef.current) {
      const mt = state.clock.getElapsedTime() * 2.5;
      const moonDist = radius * 2.2;
      moonRef.current.position.set(
        x + Math.cos(mt) * moonDist,
        Math.sin(mt * 0.8) * 0.1,
        z + Math.sin(mt) * moonDist
      );
    }
  });

  return (
    <group ref={orbitGroupRef} rotation={tilt}>
      {/* Glowing Orbit Path Line */}
      <Line
        points={orbitPoints}
        color="#e8b86d"
        opacity={0.18}
        transparent
        lineWidth={1}
      />

      {/* Orbiting Particle Tracer */}
      <mesh ref={tracerRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>

      {/* Main Planet Body */}
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Optional Planetary Ring */}
        {hasRing && (
          <mesh rotation={[Math.PI / 2.6, 0.2, 0]}>
            <ringGeometry args={[radius * 1.45, radius * 2.2, 48]} />
            <meshStandardMaterial
              color="#e8b86d"
              emissive="#e8b86d"
              emissiveIntensity={0.6}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Planet Skill Label (always faces camera) */}
        <Billboard position={[0, radius + 0.35, 0]}>
          <Text
            fontSize={0.2}
            color="#ffffff"
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.75}
            letterSpacing={0.1}
          >
            {name.toUpperCase()}
          </Text>
        </Billboard>
      </group>

      {/* Optional Moon */}
      {hasMoon && (
        <group ref={moonRef}>
          <mesh>
            <sphereGeometry args={[radius * 0.32, 16, 16]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default Planet;
