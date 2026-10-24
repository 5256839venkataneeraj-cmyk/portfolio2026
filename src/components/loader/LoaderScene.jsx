import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import Starfield from './Starfield';


// ── Easing Helpers ──
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

// ── Procedural Canvas Textures (Zero external downloads) ──
function createGlowTexture(colorStr = '#e8b86d') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, colorStr);
  gradient.addColorStop(0.25, colorStr);
  gradient.addColorStop(0.65, 'rgba(232, 184, 109, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createRaysTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  // Draw 8 thin glowing radial rays
  ctx.translate(256, 256);
  for (let i = 0; i < 8; i++) {
    ctx.rotate((Math.PI * 2) / 8);
    const grad = ctx.createLinearGradient(0, 0, 250, 0);
    grad.addColorStop(0, 'rgba(232, 184, 109, 0.9)');
    grad.addColorStop(0.5, 'rgba(0, 212, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(250, 0);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createCloudTexture(colorHex = 'rgba(232, 184, 109, 0.4)') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, colorHex);
  grad.addColorStop(0.5, colorHex.replace('0.4', '0.12'));
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── Sun Component ──
function Sun({ sharedRef, glowTex, raysTex }) {
  const chipGroupRef = useRef();
  const shockwaveRef = useRef();
  const pointLightRef = useRef();
  const coreMatRef = useRef();
  const cyanCoreMatRef = useRef();

  useFrame((state) => {
    const { introT = 0, progress = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // 0.00-0.15: Void (scale 0)
    // 0.15-0.35: Ignition (scale 0 to 1 with elastic overshoot)
    let chipScale = 0;
    if (introT >= 0.15 && introT < 0.35) {
      const p = (introT - 0.15) / 0.2;
      chipScale = easeOutElastic(p);
    } else if (introT >= 0.35) {
      chipScale = 1;
    }

    // Breathing pulse + progress swell
    const pulse = 1 + Math.sin(time * 2.2) * 0.06 + (progress / 100) * 0.15;
    const finalScale = chipScale * pulse;

    if (chipGroupRef.current) {
      chipGroupRef.current.scale.set(finalScale, finalScale, finalScale);
      chipGroupRef.current.rotation.y = time * 0.35;
      chipGroupRef.current.rotation.x = Math.sin(time * 0.4) * 0.12;
      chipGroupRef.current.position.y = Math.sin(time * 0.8) * 0.08;
    }

    // Emissive intensity rises with progress
    if (coreMatRef.current) {
      const bloomSpike = introT >= 0.15 && introT < 0.35 ? 4.5 : 2.5;
      coreMatRef.current.emissiveIntensity = (bloomSpike + (progress / 100) * 2.5);
    }

    // Shockwave ring (0.15 - 0.45)
    if (shockwaveRef.current) {
      if (introT >= 0.15 && introT < 0.45) {
        const swProgress = (introT - 0.15) / 0.3;
        const swScale = 0.5 + swProgress * 12.0;
        shockwaveRef.current.scale.set(swScale, swScale, swScale);
        shockwaveRef.current.material.opacity = (1 - swProgress) * 0.85;
        shockwaveRef.current.visible = true;
      } else {
        shockwaveRef.current.visible = false;
      }
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity = 3.5 + (progress / 100) * 4.0;
    }
  });

  // 12 Perimeter Pins
  const pinOffsets = [-0.6, -0.2, 0.2, 0.6];

  return (
    <group>
      <pointLight ref={pointLightRef} color="#e8b86d" distance={30} decay={2} />

      {/* Main 3D Chip */}
      <group ref={chipGroupRef}>
        {/* Dark Metal Silicon Body */}
        <RoundedBox args={[1.5, 1.5, 0.32]} radius={0.14} smoothness={4}>
          <meshStandardMaterial color="#080c14" roughness={0.2} metalness={0.92} />
        </RoundedBox>

        {/* Emissive Gold Core Square */}
        <RoundedBox args={[1.05, 1.05, 0.35]} radius={0.08} smoothness={3}>
          <meshStandardMaterial
            ref={coreMatRef}
            color="#e8b86d"
            emissive="#e8b86d"
            emissiveIntensity={2.5}
            roughness={0.15}
            metalness={0.5}
          />
        </RoundedBox>

        {/* Electric Cyan Center Square */}
        <RoundedBox args={[0.5, 0.5, 0.37]} radius={0.04} smoothness={2}>
          <meshStandardMaterial
            ref={cyanCoreMatRef}
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </RoundedBox>

        {/* 12 Pins around perimeter */}
        {pinOffsets.map((off, i) => (
          <React.Fragment key={i}>
            <mesh position={[off, 0.82, 0]}>
              <boxGeometry args={[0.07, 0.15, 0.05]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
            <mesh position={[off, -0.82, 0]}>
              <boxGeometry args={[0.07, 0.15, 0.05]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
            <mesh position={[0.82, off, 0]}>
              <boxGeometry args={[0.15, 0.07, 0.05]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
            <mesh position={[-0.82, off, 0]}>
              <boxGeometry args={[0.15, 0.07, 0.05]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.2} metalness={0.9} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Controlled Sun Core Glow Sprite */}
        <sprite scale={[3.2, 3.2, 1]}>
          <spriteMaterial map={glowTex} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>

        {/* Soft Radial Ray Sprite */}
        <sprite scale={[4.2, 4.2, 1]}>
          <spriteMaterial map={raysTex} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>

      {/* Flat Expanding Shockwave Ring on Orbital Plane */}
      <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.25, 48]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Planet with Rim Shell, Particles & Orbit Line ──
function Planet({
  data,
  sharedRef,
  orbitIndex,
  isMobile,
}) {
  const { name, radius, orbitA, orbitB, speed, tilt, color, emissive, hasRing, hasMoon, startAngle } = data;
  const planetRef = useRef();
  const moonRef = useRef();
  const orbitLineRef = useRef();
  const particlesRef = useRef();

  // Prepare orbit geometry points
  const segments = 96;
  const { orbitPoints, orbitGeometry } = useMemo(() => {
    const points = [];
    const positions = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * orbitA;
      const z = Math.sin(theta) * orbitB;
      points.push(new THREE.Vector3(x, 0, z));
      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { orbitPoints: points, orbitGeometry: geom };
  }, [orbitA, orbitB]);

  // Orbit draw stagger interval during 0.35 - 0.65
  const staggerStart = 0.35 + (orbitIndex * 0.05);
  const staggerEnd = staggerStart + 0.14;

  useFrame((state) => {
    const { introT = 0, progress = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // 1. Orbit draw-in animation using setDrawRange
    if (orbitLineRef.current) {
      if (introT < staggerStart) {
        orbitLineRef.current.geometry.setDrawRange(0, 0);
      } else if (introT < staggerEnd) {
        const ratio = (introT - staggerStart) / (staggerEnd - staggerStart);
        const count = Math.floor(ratio * (segments + 1));
        orbitLineRef.current.geometry.setDrawRange(0, count);
      } else {
        orbitLineRef.current.geometry.setDrawRange(0, segments + 1);
      }
    }

    // 2. Planet flare & scale in with outBack
    let scaleVal = 0;
    if (introT >= staggerEnd) {
      const enterProgress = Math.min(1, (introT - staggerEnd) / 0.12);
      scaleVal = easeOutBack(enterProgress);
    }

    // 3. Orbit movement (ramps up with progress)
    const effectiveSpeed = speed * (1 + (progress / 100) * 1.8);
    const orbitT = time * effectiveSpeed + startAngle;
    const x = Math.cos(orbitT) * orbitA;
    const z = Math.sin(orbitT) * orbitB;

    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
      planetRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      planetRef.current.rotation.y += 0.02;
    }

    // 4. 3 Light particles along orbit
    if (particlesRef.current) {
      for (let p = 0; p < 3; p++) {
        const pT = orbitT + (p * (Math.PI * 2 / 3));
        const px = Math.cos(pT) * orbitA;
        const pz = Math.sin(pT) * orbitB;
        const mesh = particlesRef.current.children[p];
        if (mesh) {
          mesh.position.set(px, 0, pz);
          mesh.visible = introT >= staggerEnd;
        }
      }
    }

    // 5. Moon orbit
    if (moonRef.current && planetRef.current && hasMoon) {
      const mt = time * 3.5;
      const mDist = radius * 2.3;
      moonRef.current.position.set(x + Math.cos(mt) * mDist, Math.sin(mt) * 0.15, z + Math.sin(mt) * mDist);
      moonRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }

  });

  return (
    <group rotation={tilt}>
      {/* Self-drawing Thin Orbit Line */}
      <line ref={orbitLineRef} geometry={orbitGeometry}>
        <lineBasicMaterial color="#e8b86d" transparent opacity={0.2} />
      </line>

      {/* 3 Orbit Light Particles */}
      <group ref={particlesRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Main Planet Body */}
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.85} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* BackSide Additive Shell for Emissive Rim Glow */}
        <mesh scale={[1.16, 1.16, 1.16]}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial color={emissive} side={THREE.BackSide} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Optional Ring for AI/ML */}
        {hasRing && (
          <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
            <ringGeometry args={[radius * 1.5, radius * 2.3, 48]} />
            <meshStandardMaterial
              color="#e8b86d"
              emissive="#e8b86d"
              emissiveIntensity={0.65}
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

      </group>

      {/* Optional Moon */}
      {hasMoon && (
        <group ref={moonRef}>
          <mesh>
            <sphereGeometry args={[radius * 0.3, 16, 16]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Note: Starfield is imported from ./Starfield with clamped point sizes (max 3px)


// ── Nebula Component with Drifting Cloud Sprites ──
function Nebula({ goldTex, cyanTex, sharedRef }) {
  const groupRef = useRef();

  useFrame((state) => {
    const { introT = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // Fade in at the end of intro (0.65 to 1.0)
    let opacityMult = 0;
    if (introT >= 0.65) {
      opacityMult = Math.min(1, (introT - 0.65) / 0.35);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.015;
      groupRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = (i % 2 === 0 ? 0.08 : 0.06) * opacityMult;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* 5 Big Additive Sprites */}
      <mesh position={[-9, 4, -14]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[22, 16]} />
        <meshBasicMaterial map={goldTex} transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[10, -5, -16]} rotation={[0, 0, -0.4]}>
        <planeGeometry args={[24, 18]} />
        <meshBasicMaterial map={cyanTex} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -2, -10]}>
        <planeGeometry args={[26, 12]} />
        <meshBasicMaterial map={goldTex} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-6, -6, -12]} rotation={[0, 0, 0.8]}>
        <planeGeometry args={[18, 14]} />
        <meshBasicMaterial map={cyanTex} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[7, 6, -18]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial map={goldTex} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Hyperspace Warp Streaks ──
function WarpStreaks({ sharedRef }) {
  const lineRef = useRef();
  const flashRef = useRef();

  const count = 120;
  const geom = useMemo(() => {
    const pos = new Float32Array(count * 2 * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = -Math.random() * 30;

      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;

      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = z - 4.0;
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return bg;
  }, []);

  useFrame((state, delta) => {
    const { warp = 0 } = sharedRef.current;

    if (lineRef.current) {
      if (warp > 0.02) {
        lineRef.current.visible = true;
        lineRef.current.material.opacity = Math.min(1, warp * 1.5);
        // Rush streaks toward camera
        const pos = lineRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          pos[i * 6 + 2] += delta * (40 + warp * 70);
          pos[i * 6 + 5] = pos[i * 6 + 2] - (2.0 + warp * 10.0);
          if (pos[i * 6 + 2] > 5) {
            pos[i * 6 + 2] = -30;
            pos[i * 6 + 5] = -34;
          }
        }
        lineRef.current.geometry.attributes.position.needsUpdate = true;
      } else {
        lineRef.current.visible = false;
      }
    }

    if (flashRef.current) {
      if (warp > 0.4) {
        flashRef.current.visible = true;
        const flashP = (warp - 0.4) / 0.6;
        flashRef.current.material.opacity = flashP * 0.95;
      } else {
        flashRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef} geometry={geom} visible={false}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Radial White-Gold Exit Flash */}
      <mesh ref={flashRef} position={[0, 0, 3]} visible={false}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial color="#fff6e5" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ── Cinematic Camera Rig ──
function CameraRig({ sharedRef, isMobile }) {
  const { camera, size, pointer } = useThree();

  // CatmullRomCurve3 for 0.65 - 1.00 intro fly-through swoop
  const swoopCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 18, 28),
      new THREE.Vector3(3.5, 12, 22),
      new THREE.Vector3(1.0, 7.0, 17),
      new THREE.Vector3(0, 4.2, 14.5),
    ]);
  }, []);

  useFrame((state, delta) => {
    const { introT = 0, progress = 0, warp = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // 1. Camera FOV widening during warp
    const baseFov = 52;
    const targetFov = baseFov + warp * 36;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }

    // 2. Camera positioning across intro & steady state
    if (introT < 0.65) {
      const initialPos = swoopCurve.getPointAt(0);
      camera.position.set(initialPos.x, initialPos.y, initialPos.z);
    } else if (introT < 1.0) {
      const p = (introT - 0.65) / 0.35;
      const easedP = easeInOutCubic(p);
      const curvePos = swoopCurve.getPointAt(easedP);
      camera.position.set(curvePos.x, curvePos.y, curvePos.z);
    } else {
      const targetZ = (14.5 - (progress / 100) * 2.8) - (warp * 6.0);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.0, delta);

      // Desktop mouse parallax
      const mx = isMobile ? 0 : pointer.x * 1.2;
      const my = isMobile ? 0 : pointer.y * 0.8;
      const targetX = mx + Math.sin(time * 0.18) * 0.6;
      const targetY = 3.6 + my + Math.cos(time * 0.14) * 0.3;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.0, delta);
    }

    // Aim camera at elevated solar system (Y = 2.5), keeping bottom half clean for title
    camera.lookAt(0, 2.5, 0);
  });

  return null;
}

// ── Master 3D LoaderScene ──
export default function LoaderScene({ sharedRef }) {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  // Procedural canvas textures
  const { glowTex, raysTex, goldCloudTex, cyanCloudTex } = useMemo(() => {
    return {
      glowTex: createGlowTexture('#e8b86d'),
      raysTex: createRaysTexture(),
      goldCloudTex: createCloudTexture('rgba(232, 184, 109, 0.4)'),
      cyanCloudTex: createCloudTexture('rgba(0, 212, 255, 0.35)'),
    };
  }, []);

  // 6 Skill Planets data
  const planetsData = useMemo(() => [
    { name: 'REACT', radius: 0.28, orbitA: 3.2, orbitB: 2.5, speed: 0.72, tilt: [0.18, 0.08, 0], color: '#00d4ff', emissive: '#00d4ff', startAngle: 0.4 },
    { name: 'PYTHON', radius: 0.34, orbitA: 4.6, orbitB: 3.6, speed: 0.52, tilt: [-0.14, 0.15, 0.1], color: '#e8b86d', emissive: '#e8b86d', startAngle: 2.2 },
    { name: 'AI / ML', radius: 0.42, orbitA: 6.2, orbitB: 4.8, speed: 0.38, tilt: [0.25, -0.12, 0.05], color: '#e8b86d', emissive: '#e8b86d', hasRing: true, startAngle: 4.1 },
    { name: 'NODE.JS', radius: 0.3, orbitA: 7.8, orbitB: 6.0, speed: 0.3, tilt: [-0.2, -0.18, 0], color: '#00d4ff', emissive: '#00d4ff', hasMoon: true, startAngle: 1.4 },
    { name: 'TYPESCRIPT', radius: 0.32, orbitA: 9.4, orbitB: 7.2, speed: 0.24, tilt: [0.12, 0.22, -0.08], color: '#38bdf8', emissive: '#38bdf8', hasMoon: true, startAngle: 3.6 },
    { name: 'DOCKER', radius: 0.35, orbitA: 11.0, orbitB: 8.5, speed: 0.19, tilt: [-0.15, 0.1, 0.15], color: '#c5a880', emissive: '#c5a880', startAngle: 5.2 },
  ], []);

  // Clean disposal of textures on unmount
  useEffect(() => {
    return () => {
      glowTex.dispose();
      raysTex.dispose();
      goldCloudTex.dispose();
      cyanCloudTex.dispose();
    };
  }, [glowTex, raysTex, goldCloudTex, cyanCloudTex]);

  return (
    <Canvas
      camera={{ position: [0, 16, 26], fov: 55, near: 0.1, far: 120 }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05070a']} />
      <ambientLight intensity={0.4} color="#0c1220" />

      {/* Camera Controller & View Offset */}
      <CameraRig sharedRef={sharedRef} isMobile={isMobile} />

      {/* Starfield, Nebula, Hyperspace Streaks */}
      <Starfield isMobile={isMobile} />
      <Nebula goldTex={goldCloudTex} cyanTex={cyanCloudTex} sharedRef={sharedRef} />
      <WarpStreaks sharedRef={sharedRef} />

      {/* Elevated 3D Solar System (Sitting in upper 55% of viewport) */}
      <group position={[0, 2.5, 0]}>
        {/* Sun Chip */}
        <Sun sharedRef={sharedRef} glowTex={glowTex} raysTex={raysTex} />

        {/* 5-6 Planets on Tilted Orbits */}
        {planetsData.slice(0, isMobile ? 5 : 6).map((data, idx) => (
          <Planet
            key={data.name}
            data={data}
            sharedRef={sharedRef}
            orbitIndex={idx}
            isMobile={isMobile}
          />
        ))}
      </group>

      {/* Postprocessing Stack: Tuned Bloom to Avoid Washing Out Screen */}
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom luminanceThreshold={0.65} luminanceSmoothing={0.75} intensity={0.75} mipmapBlur />
        <Vignette eskil={false} offset={0.16} darkness={0.88} />
        {!isMobile && (
          <>
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} radialModulation={false} />
            <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.03} />
          </>
        )}
      </EffectComposer>
    </Canvas>
  );
}
