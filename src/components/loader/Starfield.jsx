import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Starfield({ isMobile = false }) {
  const pointsRef1 = useRef();
  const pointsRef2 = useRef();
  const shootingStarRef = useRef();

  const totalCount = isMobile ? 600 : 1200;
  const count1 = Math.floor(totalCount * 0.7);
  const count2 = Math.floor(totalCount * 0.3);

  // Clamped point shader material (Max 3.0px on screen, zero oversized bokeh discs)
  const starMaterial = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPR: { value: dpr },
        uBaseSize: { value: 1.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPR;
        uniform float uBaseSize;
        attribute float aSize;
        attribute float aTwinkle;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;
          float twinkle = sin(uTime * aTwinkle + position.x * 2.0) * 0.35 + 0.65;
          vAlpha = twinkle;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Clamp gl_PointSize strictly between 1.0 * uPR and 3.0 * uPR
          float rawSize = aSize * uBaseSize * uPR * (300.0 / -mvPosition.z);
          gl_PointSize = clamp(rawSize, 1.0 * uPR, 3.0 * uPR);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          // Soft circular falloff
          float intensity = pow(1.0 - dist * 2.0, 1.8);
          gl_FragColor = vec4(vColor, vAlpha * intensity * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Geometry generator with stars placed safely in deep space (Z: -5 to -45)
  const makeGeom = (cnt, zMin, zMax, spread) => {
    const pos = new Float32Array(cnt * 3);
    const col = new Float32Array(cnt * 3);
    const spd = new Float32Array(cnt);
    const siz = new Float32Array(cnt);

    const cGold = new THREE.Color('#e8b86d');
    const cCyan = new THREE.Color('#00d4ff');
    const cWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < cnt; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.75;
      pos[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);

      const r = Math.random();
      const choice = r < 0.6 ? cWhite : r < 0.85 ? cGold : cCyan;
      col[i * 3] = choice.r;
      col[i * 3 + 1] = choice.g;
      col[i * 3 + 2] = choice.b;

      spd[i] = 1.0 + Math.random() * 3.0;
      siz[i] = 0.8 + Math.random() * 0.8;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geom.setAttribute('aTwinkle', new THREE.BufferAttribute(spd, 1));
    geom.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    return geom;
  };

  const geom1 = useMemo(() => makeGeom(count1, -40, -18, 65), [count1]);
  const geom2 = useMemo(() => makeGeom(count2, -18, -6, 45), [count2]);

  // Shooting star state
  const shootingData = useRef({
    active: false,
    x: -20,
    y: 10,
    z: -10,
    vx: 1.2,
    vy: -0.6,
    timer: 0,
  });

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    starMaterial.uniforms.uTime.value = t;

    if (pointsRef1.current) {
      pointsRef1.current.rotation.y = t * 0.01;
      pointsRef1.current.rotation.x = t * 0.005;
    }
    if (pointsRef2.current) {
      pointsRef2.current.rotation.y = -t * 0.015;
    }

    // Shooting star animation
    const sd = shootingData.current;
    sd.timer += delta;
    if (sd.timer > 4.0 && !sd.active) {
      sd.active = true;
      sd.x = -22 + (Math.random() - 0.5) * 10;
      sd.y = 8 + (Math.random() - 0.5) * 6;
      sd.z = -12;
      sd.timer = 0;
    }

    if (sd.active && shootingStarRef.current) {
      sd.x += sd.vx * delta * 30;
      sd.y += sd.vy * delta * 30;
      shootingStarRef.current.position.set(sd.x, sd.y, sd.z);

      if (sd.x > 25 || sd.y < -15) {
        sd.active = false;
        sd.timer = 0;
        shootingStarRef.current.position.set(-999, -999, -999);
      }
    }
  });

  return (
    <group>
      {/* Background Deep Stars */}
      <points ref={pointsRef1} geometry={geom1} material={starMaterial} />

      {/* Mid-ground Stars */}
      <points ref={pointsRef2} geometry={geom2} material={starMaterial} />

      {/* Subtle Shooting Star Streak */}
      <mesh ref={shootingStarRef} position={[-999, -999, -999]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.015, 0.05, 3.0, 8]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default Starfield;
