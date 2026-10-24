import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── Easing Utilities ──
function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── Canvas Procedural Textures (Zero External Downloads) ──
function createGlowTexture(colorStr = '#e8b86d') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, colorStr);
  gradient.addColorStop(0.25, colorStr);
  gradient.addColorStop(0.65, 'rgba(232, 184, 109, 0.18)');
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
  ctx.translate(256, 256);
  for (let i = 0; i < 8; i++) {
    ctx.rotate((Math.PI * 2) / 8);
    const grad = ctx.createLinearGradient(0, 0, 250, 0);
    grad.addColorStop(0, 'rgba(232, 184, 109, 0.85)');
    grad.addColorStop(0.45, 'rgba(0, 212, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(250, 0);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── Sun Component (1.6x Scale, Chip Theme) ──
function Sun({ sharedRef, glowTex, raysTex }) {
  const chipRef = useRef();
  const shockwaveRef = useRef();
  const easterShockwaveRef = useRef();
  const pointLightRef = useRef();
  const coreMatRef = useRef();

  useFrame((state) => {
    const { p = 0, easterEggPulse = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // 0.00-0.20: Tiny light swells
    // 0.20-0.45: Elastic ignition scale-in
    let scaleVal = 0;
    if (p < 0.2) {
      scaleVal = (p / 0.2) * 0.22;
    } else if (p < 0.45) {
      const ignitionT = (p - 0.2) / 0.25;
      scaleVal = 0.22 + (1.6 - 0.22) * easeOutElastic(ignitionT);
    } else {
      // 0.45-0.75: Alignment pulse
      const alignPulse = (p >= 0.65 && p <= 0.75) ? Math.sin((p - 0.65) * 10 * Math.PI) * 0.18 : 0;
      scaleVal = 1.6 + Math.sin(time * 2.0) * 0.05 + alignPulse;
    }

    if (chipRef.current) {
      chipRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      chipRef.current.rotation.y = time * 0.35;
      chipRef.current.rotation.x = Math.sin(time * 0.28) * 0.08;
      chipRef.current.position.y = Math.sin(time * 0.65) * 0.05;
    }

    // Emissive intensity rises with p, peaking at alignment
    if (coreMatRef.current) {
      const peak = (p >= 0.55 && p <= 0.75) ? 4.5 : 2.8 + p * 1.6;
      coreMatRef.current.emissiveIntensity = peak;
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity = 3.5 + p * 4.5;
    }

    // Shockwave ring on ignition (0.20 - 0.42)
    if (shockwaveRef.current) {
      if (p >= 0.2 && p < 0.42) {
        shockwaveRef.current.visible = true;
        const sw = (p - 0.2) / 0.22;
        const s = 0.8 + sw * 16;
        shockwaveRef.current.scale.set(s, s, s);
        shockwaveRef.current.material.opacity = (1 - sw) * 0.75;
      } else {
        shockwaveRef.current.visible = false;
      }
    }

    // Easter egg click / overscroll pulse
    if (easterShockwaveRef.current) {
      if (easterEggPulse > 0.01) {
        easterShockwaveRef.current.visible = true;
        const s = 1.2 + easterEggPulse * 18;
        easterShockwaveRef.current.scale.set(s, s, s);
        easterShockwaveRef.current.material.opacity = (1 - easterEggPulse) * 0.85;
      } else {
        easterShockwaveRef.current.visible = false;
      }
    }
  });

  const pinOffsets = [-0.96, -0.32, 0.32, 0.96];

  return (
    <group>
      <pointLight ref={pointLightRef} color="#e8b86d" distance={40} decay={2} />

      {/* 3D Chip Group scaled 1.6x */}
      <group ref={chipRef}>
        <RoundedBox args={[2.4, 2.4, 0.42]} radius={0.18} smoothness={4}>
          <meshStandardMaterial color="#080c14" roughness={0.2} metalness={0.92} />
        </RoundedBox>

        <RoundedBox args={[1.68, 1.68, 0.46]} radius={0.12} smoothness={3}>
          <meshStandardMaterial
            ref={coreMatRef}
            color="#e8b86d"
            emissive="#e8b86d"
            emissiveIntensity={3.2}
            roughness={0.15}
            metalness={0.5}
          />
        </RoundedBox>

        <RoundedBox args={[0.8, 0.8, 0.49]} radius={0.06} smoothness={2}>
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={2.8} roughness={0.1} />
        </RoundedBox>

        {pinOffsets.map((off, i) => (
          <React.Fragment key={i}>
            <mesh position={[off, 1.3, 0]}>
              <boxGeometry args={[0.1, 0.22, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.5} metalness={0.9} />
            </mesh>
            <mesh position={[off, -1.3, 0]}>
              <boxGeometry args={[0.1, 0.22, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.5} metalness={0.9} />
            </mesh>
            <mesh position={[1.3, off, 0]}>
              <boxGeometry args={[0.22, 0.1, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.5} metalness={0.9} />
            </mesh>
            <mesh position={[-1.3, off, 0]}>
              <boxGeometry args={[0.22, 0.1, 0.06]} />
              <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={1.5} metalness={0.9} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Soft Radial Sun Glow Sprite */}
        <sprite scale={[7.5, 7.5, 1]}>
          <spriteMaterial map={glowTex} transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        <sprite scale={[11.5, 11.5, 1]}>
          <spriteMaterial map={raysTex} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>

      {/* Flat Ignition Shockwave Ring */}
      <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[1.2, 1.6, 48]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.75} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Easter Egg Click / Overscroll Shockwave */}
      <mesh ref={easterShockwaveRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[1.2, 1.7, 48]} />
        <meshBasicMaterial color="#e8b86d" transparent opacity={0.7} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Outro Planet with Orbit → Linear Alignment Animation (1.7x Scale) ──
function OutroPlanet({
  data,
  sharedRef,
  orbitIndex,
  totalPlanets,
  isMobile,
}) {
  const { name, radius, orbitA, orbitB, speed, tilt, color, emissive, hasRing, hasMoon, startAngle } = data;
  const planetRef = useRef();
  const moonRef = useRef();
  const orbitLineRef = useRef();
  const labelRef = useRef();

  // Segments for orbit line
  const segments = 96;
  const orbitGeom = useMemo(() => {
    const positions = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * orbitA;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(theta) * orbitB;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [orbitA, orbitB]);

  // Aligned slot target position:
  // Positioned at ~42% of the viewport height (y = -1.75 in world coordinates, clearly above the title)
  const alignedPos = useMemo(() => {
    if (isMobile) {
      // 2-row arc for mobile
      const row = orbitIndex < 3 ? 0 : 1;
      const col = row === 0 ? orbitIndex : orbitIndex - 3;
      const countInRow = row === 0 ? 3 : 2;
      const spacing = 1.65;
      const x = (col - (countInRow - 1) / 2) * spacing;
      const y = row === 0 ? -1.3 : -2.6;
      return new THREE.Vector3(x, y, 0);
    }
    // Desktop: single horizontal row at y = -1.75 (42% viewport height)
    const spacing = 2.45;
    const x = (orbitIndex - (totalPlanets - 1) / 2) * spacing;
    return new THREE.Vector3(x, -1.75, 0);
  }, [orbitIndex, totalPlanets, isMobile]);

  useFrame((state) => {
    const { p = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // 1. Orbit draw during 0.20 - 0.45 at 0.35 opacity
    if (orbitLineRef.current) {
      const drawStart = 0.2 + orbitIndex * 0.035;
      const drawEnd = drawStart + 0.12;
      if (p < drawStart) {
        orbitLineRef.current.geometry.setDrawRange(0, 0);
        orbitLineRef.current.material.opacity = 0;
      } else if (p < drawEnd) {
        const ratio = (p - drawStart) / (drawEnd - drawStart);
        orbitLineRef.current.geometry.setDrawRange(0, Math.floor(ratio * (segments + 1)));
        orbitLineRef.current.material.opacity = 0.35;
      } else if (p < 0.45) {
        orbitLineRef.current.geometry.setDrawRange(0, segments + 1);
        orbitLineRef.current.material.opacity = 0.35;
      } else {
        // Orbit lines fade out during linear alignment (0.45 - 0.70)
        const fade = Math.max(0, 1 - (p - 0.45) / 0.2);
        orbitLineRef.current.material.opacity = 0.35 * fade;
      }
    }

    // 2. Planet Position: Elliptical orbit position
    const orbitT = time * speed + startAngle;
    const orbitX = Math.cos(orbitT) * orbitA;
    const orbitZ = Math.sin(orbitT) * orbitB;
    const currentOrbitPos = new THREE.Vector3(orbitX, 0, orbitZ);

    const euler = new THREE.Euler(tilt[0], tilt[1], tilt[2]);
    currentOrbitPos.applyEuler(euler);

    // 3. Interpolation between orbit and aligned row (0.45 - 0.75)
    let alignmentRatio = 0;
    if (p >= 0.45 && p < 0.75) {
      alignmentRatio = easeInOutCubic((p - 0.45) / 0.3);
    } else if (p >= 0.75) {
      alignmentRatio = 1.0;
    }

    const finalPos = new THREE.Vector3().lerpVectors(currentOrbitPos, alignedPos, alignmentRatio);

    // Scale-in during 0.22 - 0.40
    let scaleVal = 0;
    if (p >= 0.22 && p < 0.4) {
      scaleVal = (p - 0.22) / 0.18;
    } else if (p >= 0.4) {
      scaleVal = 1.0;
    }

    if (planetRef.current) {
      planetRef.current.position.copy(finalPos);
      planetRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      planetRef.current.rotation.y += 0.015;
    }

    // 4. Moon
    if (moonRef.current && planetRef.current && hasMoon) {
      const mt = time * 3.0;
      const mDist = radius * 2.3;
      moonRef.current.position.set(
        finalPos.x + Math.cos(mt) * mDist,
        finalPos.y + Math.sin(mt * 0.7) * 0.15,
        finalPos.z + Math.sin(mt) * mDist
      );
      moonRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }

    // 5. Direct DOM skill tag label under the planet
    if (labelRef.current) {
      if (p >= 0.3 && p < 0.55) {
        const tp = (p - 0.3) / 0.25;
        const chars = Math.max(1, Math.floor(tp * name.length));
        labelRef.current.textContent = name.slice(0, chars);
        labelRef.current.parentElement.style.opacity = `${tp * 0.85}`;
      } else if (p >= 0.55) {
        labelRef.current.textContent = name;
        labelRef.current.parentElement.style.opacity = '1';
      } else {
        labelRef.current.textContent = '';
        labelRef.current.parentElement.style.opacity = '0';
      }
    }
  });

  return (
    <group>
      {/* Orbit Line at 0.35 opacity */}
      <group rotation={tilt}>
        <line ref={orbitLineRef} geometry={orbitGeom}>
          <lineBasicMaterial color="#e8b86d" transparent opacity={0.35} />
        </line>
      </group>

      {/* Planet Body */}
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.9} roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Subtle BackSide Rim Glow */}
        <mesh scale={[1.14, 1.14, 1.14]}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial color={emissive} side={THREE.BackSide} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>

        {hasRing && (
          <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
            <ringGeometry args={[radius * 1.5, radius * 2.3, 48]} />
            <meshStandardMaterial color="#e8b86d" emissive="#e8b86d" emissiveIntensity={0.7} transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Dark Pill Skill Tag Label Underneath Planet (0.7rem font-size) */}
        <Html position={[0, -(radius + 0.48), 0]} center pointerEvents="none">
          <div className="px-2.5 py-0.5 rounded-full bg-[#05070a]/90 border border-[#00d4ff]/40 backdrop-blur-md shadow-[0_0_10px_rgba(0,212,255,0.2)] flex items-center justify-center whitespace-nowrap opacity-0 transition-opacity duration-300">
            <span
              ref={labelRef}
              className="font-mono text-[11px] text-[#00d4ff] tracking-widest uppercase font-bold select-none drop-shadow-[0_0_6px_rgba(0,212,255,0.6)]"
            />
          </div>
        </Html>
      </group>

      {hasMoon && (
        <group ref={moonRef}>
          <mesh>
            <sphereGeometry args={[radius * 0.3, 16, 16]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ── Starfield with Clamped Point Sizes (1.0 to 3.5 px * uPR) ──
function Starfield({ isMobile, sharedRef }) {
  const p1 = useRef();
  const p2 = useRef();

  const totalCount = isMobile ? 900 : 2000;
  const count1 = Math.floor(totalCount * 0.65);
  const count2 = Math.floor(totalCount * 0.35);

  const mat = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAlpha: { value: 0 },
        uPR: { value: dpr },
        uBaseSize: { value: 1.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPR;
        uniform float uBaseSize;
        attribute float aSize;
        attribute float aTwinkleSpeed;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;
          float twinkle = sin(uTime * aTwinkleSpeed + position.x * 2.0) * 0.35 + 0.65;
          vAlpha = twinkle;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Clamp gl_PointSize strictly between 1.0 * uPR and 3.5 * uPR
          float rawSize = aSize * uBaseSize * uPR * (300.0 / -mvPosition.z);
          gl_PointSize = clamp(rawSize, 1.0 * uPR, 3.5 * uPR);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          // Soft circular falloff
          float intensity = pow(1.0 - dist * 2.0, 1.8);
          gl_FragColor = vec4(vColor, vAlpha * intensity * uAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const makeGeom = (cnt, zMin, zMax, spread) => {
    const pos = new Float32Array(cnt * 3);
    const col = new Float32Array(cnt * 3);
    const spd = new Float32Array(cnt);
    const sz = new Float32Array(cnt);

    for (let i = 0; i < cnt; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      // Keep stars safely in deep background (-20 to -65) so none come close to camera
      pos[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);

      const r = Math.random();
      if (r < 0.65) {
        col[i * 3] = 0.98; col[i * 3 + 1] = 0.96; col[i * 3 + 2] = 0.92;
      } else if (r < 0.85) {
        col[i * 3] = 0.91; col[i * 3 + 1] = 0.72; col[i * 3 + 2] = 0.43;
      } else {
        col[i * 3] = 0.0; col[i * 3 + 1] = 0.83; col[i * 3 + 2] = 1.0;
      }
      spd[i] = 1.5 + Math.random() * 3.0;
      sz[i] = 0.85 + Math.random() * 0.7;
    }

    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    bg.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    bg.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(spd, 1));
    bg.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    return bg;
  };

  const g1 = useMemo(() => makeGeom(count1, -40, -65, 85), [count1]);
  const g2 = useMemo(() => makeGeom(count2, -22, -38, 60), [count2]);

  useFrame((state) => {
    const { p = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();
    mat.uniforms.uTime.value = time;
    mat.uniforms.uAlpha.value = Math.min(1, p / 0.18);

    if (p1.current) p1.current.rotation.y = time * 0.008;
    if (p2.current) p2.current.rotation.y = -time * 0.014;
  });

  return (
    <group>
      <points ref={p1} geometry={g1} material={mat} />
      <points ref={p2} geometry={g2} material={mat} />
    </group>
  );
}

// ── Reverse Warp Streaks (For Back to Top) ──
function ReverseWarp({ sharedRef }) {
  const lineRef = useRef();
  const flashRef = useRef();

  const count = 90;
  const geom = useMemo(() => {
    const pos = new Float32Array(count * 2 * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = -Math.random() * 25;
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = x * 1.25;
      pos[i * 6 + 4] = y * 1.25;
      pos[i * 6 + 5] = z + 3.5;
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return bg;
  }, []);

  useFrame((_, delta) => {
    const { reverseWarp = 0 } = sharedRef.current;
    if (lineRef.current) {
      if (reverseWarp > 0.02) {
        lineRef.current.visible = true;
        lineRef.current.material.opacity = Math.min(1, reverseWarp * 1.5);
        const pos = lineRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          pos[i * 6 + 2] -= delta * 60;
          pos[i * 6 + 5] = pos[i * 6 + 2] + 4.0;
          if (pos[i * 6 + 2] < -35) {
            pos[i * 6 + 2] = 2;
            pos[i * 6 + 5] = 6;
          }
        }
        lineRef.current.geometry.attributes.position.needsUpdate = true;
      } else {
        lineRef.current.visible = false;
      }
    }
    if (flashRef.current) {
      if (reverseWarp > 0.3) {
        flashRef.current.visible = true;
        flashRef.current.material.opacity = (reverseWarp - 0.3) * 1.2;
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
      <mesh ref={flashRef} position={[0, 0, 3]} visible={false}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial color="#fff6e5" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ── Outro Camera Rig: Split Viewport (Sun sits at ~30% height from top) ──
function OutroCameraRig({ sharedRef, isMobile }) {
  const { camera, size, pointer } = useThree();

  const swoopCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 16, 26),
      new THREE.Vector3(3.5, 9, 20),
      new THREE.Vector3(1.2, 4.2, 15.5),
      new THREE.Vector3(0, 2.5, 13.5),
    ]);
  }, []);

  useEffect(() => {
    // Top 55% zone: Sun at about 30% height from top
    // Standard viewport center is 50%. An offset of -0.20 * height pushes world (0,0,0) UP to 30% from the top
    const yOff = -size.height * 0.20;
    camera.setViewOffset(size.width, size.height, 0, yOff, size.width, size.height);
  }, [camera, size]);

  useFrame((state, delta) => {
    const { p = 0 } = sharedRef.current;
    const time = state.clock.getElapsedTime();

    // Swoop down during 0.20 - 0.45
    if (p < 0.2) {
      const init = swoopCurve.getPointAt(0);
      camera.position.set(init.x, init.y, init.z);
    } else if (p < 0.45) {
      const sp = (p - 0.2) / 0.25;
      const eased = easeInOutCubic(sp);
      const pos = swoopCurve.getPointAt(eased);
      camera.position.set(pos.x, pos.y, pos.z);
    } else {
      // Steady state: low cinematic angle + subtle parallax
      const targetZ = 13.5 - (p - 0.45) * 1.5;
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.0, delta);

      const mx = isMobile ? 0 : pointer.x * 1.2;
      const my = isMobile ? 0 : pointer.y * 0.8;
      const tx = mx + Math.sin(time * 0.16) * 0.5;
      const ty = 2.4 + my + Math.cos(time * 0.12) * 0.25;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2.0, delta);
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── OutroScene Main Component ──
export default function OutroScene({ sharedRef }) {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const { glowTex, raysTex } = useMemo(() => {
    return {
      glowTex: createGlowTexture('#e8b86d'),
      raysTex: createRaysTexture(),
    };
  }, []);

  // 6 Skill Planets data with 1.7x scaled radii
  const planetsData = useMemo(() => [
    { name: 'REACT', radius: 0.48, orbitA: 3.6, orbitB: 2.8, speed: 0.72, tilt: [0.18, 0.08, 0], color: '#00d4ff', emissive: '#00d4ff', startAngle: 0.4 },
    { name: 'PYTHON', radius: 0.58, orbitA: 5.2, orbitB: 4.0, speed: 0.52, tilt: [-0.14, 0.15, 0.1], color: '#e8b86d', emissive: '#e8b86d', startAngle: 2.2 },
    { name: 'AI / ML', radius: 0.70, orbitA: 6.8, orbitB: 5.2, speed: 0.38, tilt: [0.25, -0.12, 0.05], color: '#e8b86d', emissive: '#e8b86d', hasRing: true, startAngle: 4.1 },
    { name: 'NODE.JS', radius: 0.51, orbitA: 8.4, orbitB: 6.4, speed: 0.3, tilt: [-0.2, -0.18, 0], color: '#00d4ff', emissive: '#00d4ff', hasMoon: true, startAngle: 1.4 },
    { name: 'TYPESCRIPT', radius: 0.55, orbitA: 10.0, orbitB: 7.6, speed: 0.24, tilt: [0.12, 0.22, -0.08], color: '#38bdf8', emissive: '#38bdf8', hasMoon: true, startAngle: 3.6 },
    { name: 'DOCKER', radius: 0.60, orbitA: 11.6, orbitB: 8.8, speed: 0.19, tilt: [-0.15, 0.1, 0.15], color: '#c5a880', emissive: '#c5a880', startAngle: 5.2 },
  ], []);

  useEffect(() => {
    return () => {
      glowTex.dispose();
      raysTex.dispose();
    };
  }, [glowTex, raysTex]);

  const activePlanets = isMobile ? planetsData.slice(0, 5) : planetsData;

  return (
    <Canvas
      camera={{ position: [0, 16, 26], fov: 55, near: 0.1, far: 120 }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      {/* Opaque #05070a Background */}
      <color attach="background" args={['#05070a']} />
      <ambientLight intensity={0.35} color="#0c1220" />

      <OutroCameraRig sharedRef={sharedRef} isMobile={isMobile} />
      <Starfield isMobile={isMobile} sharedRef={sharedRef} />
      <ReverseWarp sharedRef={sharedRef} />

      {/* Sun Chip (1.6x Scale) */}
      <Sun sharedRef={sharedRef} glowTex={glowTex} raysTex={raysTex} />

      {/* 6 Planets (1.7x Scale) with Linear Alignment at 42% height */}
      {activePlanets.map((data, idx) => (
        <OutroPlanet
          key={data.name}
          data={data}
          sharedRef={sharedRef}
          orbitIndex={idx}
          totalPlanets={activePlanets.length}
          isMobile={isMobile}
        />
      ))}

      {/* Postprocessing Stack: Bloom luminanceThreshold 0.65, intensity <= 0.8, mipmapBlur */}
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          luminanceThreshold={0.65}
          luminanceSmoothing={0.85}
          intensity={0.75}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.18} darkness={0.82} />
      </EffectComposer>
    </Canvas>
  );
}
