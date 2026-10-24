import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── 1. Ease In-Out Cubic Function ──
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── 2. Pseudo-random Seeded Generator (Deterministic) ──
function createRandom(seed = 12345) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── 3. Build Custom Curved & Cupped Petal Geometry (5 cols x 9 rows) ──
function createPetalGeometry() {
  const cols = 5;
  const rows = 9;
  const positions = [];
  const uvs = [];
  const indices = [];

  // World dimensions of a single petal:
  // Length ~ 0.24 world units (approx 18-22px on 1440px viewport with FOV 40 at z=14)
  const length = 0.24;
  const maxWidth = 0.095;

  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1); // 0 at base, 1 at tip

    // Width profile: pointed tip, widest at ~40% length, narrow rounded base
    let w = 0;
    if (v < 0.4) {
      // Base (v=0) to widest point (v=0.4)
      const t = v / 0.4;
      w = maxWidth * (0.28 + 0.72 * Math.sin(t * (Math.PI / 2)));
    } else {
      // Widest point (v=0.4) to pointed tip (v=1.0)
      const t = (v - 0.4) / 0.6;
      w = maxWidth * Math.cos(t * (Math.PI / 2));
    }

    // Longitudinal arch (curl along length)
    const zArch = Math.sin(v * Math.PI) * 0.038 - v * 0.016;

    for (let i = 0; i < cols; i++) {
      const u = (i / (cols - 1)) * 2 - 1; // -1 (left edge) to +1 (right edge)
      const x = u * (w * 0.5);
      const y = (v - 0.15) * length;

      // Transverse cupping: edges lift up slightly
      const zCup = (u * u) * 0.024;
      const z = zArch + zCup;

      positions.push(x, y, z);
      uvs.push((u + 1) * 0.5, v);
    }
  }

  // Create grid triangle indices
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i;
      const b = j * cols + (i + 1);
      const c = (j + 1) * cols + i;
      const d = (j + 1) * cols + (i + 1);

      // Two triangles per grid quad
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// ── 4. Main 3D Scene Component ──
export default function PetalScene({ progressRef, mouseRef, isMobile = false }) {
  const { camera } = useThree();
  const instancedMeshRef = useRef(null);
  const groupRef = useRef(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Total petals: 1200 desktop, 600 mobile
  const count = isMobile ? 600 : 1200;

  // Build the single custom petal geometry once
  const petalGeometry = useMemo(() => createPetalGeometry(), []);

  // Shared material: crisp MeshStandardMaterial, DoubleSide, roughness 0.55, metalness 0
  const petalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        roughness: 0.55,
        metalness: 0.0,
        vertexColors: false,
      }),
    []
  );

  // Palette: 65% reds, 35% cream whites
  const palette = useMemo(() => {
    const reds = ['#8a0f1f', '#b3122b', '#d6283e'].map((hex) => new THREE.Color(hex));
    const whites = ['#f4efe6', '#fffaf2', '#f7e6e4'].map((hex) => new THREE.Color(hex));
    return { reds, whites };
  }, []);

  // Reused objects for zero allocations per frame
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const spinQuat = useMemo(() => new THREE.Quaternion(), []);

  // ── Precompute Deterministic Petal Motion Data & Colors ──
  const { petalData, colors } = useMemo(() => {
    const rnd = createRandom(42819);
    const data = [];
    const colorArray = new Float32Array(count * 3);
    const tempColor = new THREE.Color();

    const maxR = 0.16 * Math.sqrt(count); // Bloom width ~ 5.5 units

    for (let i = 0; i < count; i++) {
      // Golden angle phyllotaxis spiral
      const radius = 0.16 * Math.sqrt(i);
      const angle = i * 2.39996; // Golden angle in radians

      // Home position in the bloom
      const homeX = radius * Math.cos(angle);
      const homeY = radius * Math.sin(angle);
      // Small z offset by layer so petals overlap like a natural rose
      const layerZ = -((count - i) * 0.0018) + (rnd() - 0.5) * 0.02;

      // Home orientation: point outward from center + tilt up toward viewer
      const facingAngle = angle - Math.PI / 2;
      const tiltOut = 0.22 + (radius / maxR) * 0.82; // Inner petals flatter, outer petals lean open
      const homeEuler = new THREE.Euler(
        tiltOut * Math.cos(facingAngle),
        tiltOut * Math.sin(facingAngle),
        facingAngle + (rnd() - 0.5) * 0.25,
        'ZYX'
      );
      const homeQuat = new THREE.Quaternion().setFromEuler(homeEuler);

      // Scatter direction vector: outwards and 3D spherical burst
      const dirTheta = rnd() * Math.PI * 2;
      const dirPhi = (rnd() - 0.5) * Math.PI * 0.85;
      const dirX = Math.cos(dirTheta) * Math.cos(dirPhi);
      const dirY = Math.sin(dirTheta) * Math.cos(dirPhi) + 0.15; // slight upward bias
      const dirZ = Math.sin(dirPhi) + (rnd() > 0.5 ? 0.35 : -0.35);
      const dir = new THREE.Vector3(dirX, dirY, dirZ).normalize();

      // Scatter distance: 4 to 12 units
      const dist = 4.0 + rnd() * 8.0;

      // Spin axis & speed
      const spinAxis = new THREE.Vector3(
        (rnd() - 0.5) * 2,
        (rnd() - 0.5) * 2,
        (rnd() - 0.5) * 2
      ).normalize();
      const spinSpeed = 0.8 + rnd() * 1.6;

      // Sway frequencies and phases
      const f1 = 0.8 + rnd() * 0.6;
      const f2 = 0.9 + rnd() * 0.5;
      const f3 = 0.7 + rnd() * 0.7;
      const ph1 = rnd() * Math.PI * 2;
      const ph2 = rnd() * Math.PI * 2;
      const ph3 = rnd() * Math.PI * 2;

      // Delay order: Petals farther from bloom center leave FIRST and come back LAST
      const normalizedRadius = Math.min(1, Math.max(0, radius / maxR));
      const delay = (1.0 - normalizedRadius) * 0.35;

      data.push({
        homePos: new THREE.Vector3(homeX, homeY, layerZ),
        homeQuat,
        dir,
        dist,
        spinAxis,
        spinSpeed,
        f1,
        f2,
        f3,
        ph1,
        ph2,
        ph3,
        delay,
      });

      // Color assignment: 65% reds, 35% whites
      const isRed = rnd() < 0.65;
      const colorChoices = isRed ? palette.reds : palette.whites;
      const baseCol = colorChoices[Math.floor(rnd() * colorChoices.length)];

      tempColor.copy(baseCol);
      // Small random brightness variation per petal (±5%)
      const variation = 0.95 + rnd() * 0.1;
      tempColor.r = Math.min(1, tempColor.r * variation);
      tempColor.g = Math.min(1, tempColor.g * variation);
      tempColor.b = Math.min(1, tempColor.b * variation);

      colorArray[i * 3] = tempColor.r;
      colorArray[i * 3 + 1] = tempColor.g;
      colorArray[i * 3 + 2] = tempColor.b;
    }

    return { petalData: data, colors: colorArray };
  }, [count, palette]);

  // Set colors onto InstancedMesh on mount
  useEffect(() => {
    if (!instancedMeshRef.current) return;
    const mesh = instancedMeshRef.current;
    const tempCol = new THREE.Color();
    for (let i = 0; i < count; i++) {
      tempCol.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      mesh.setColorAt(i, tempCol);
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [count, colors]);

  // Cleanup geometry & material on unmount
  useEffect(() => {
    return () => {
      petalGeometry.dispose();
      petalMaterial.dispose();
    };
  }, [petalGeometry, petalMaterial]);

  // ── 5. Pure Frame Loop: Math(T) Without Simulation ──
  useFrame(() => {
    if (!instancedMeshRef.current) return;

    // Read current scroll progress p (0 to 1) from ref
    const p = progressRef ? progressRef.current : 0;

    // Map scroll progress p to animation parameter T(p)
    // - p 0.00-0.15: T = 0 (bloom)
    // - p 0.15-0.50: T rises 0 to 1 (scatter)
    // - p 0.50-0.60: T = 1 (suspended)
    // - p 0.60-0.92: T falls 1 to 0 (rebuilding along exact same curve)
    // - p 0.92-1.00: T = 0 (bloom rebuilt)
    let T = 0;
    if (prefersReducedMotion) {
      T = 0;
    } else if (p < 0.15) {
      T = 0;
    } else if (p < 0.5) {
      T = (p - 0.15) / 0.35;
    } else if (p < 0.6) {
      T = 1;
    } else if (p < 0.92) {
      T = 1 - (p - 0.6) / 0.32;
    } else {
      T = 0;
    }

    // Clamp T
    T = Math.min(1, Math.max(0, T));

    // Slow camera dolly of about 8% over full scroll (from z=14.0 to z=14.9)
    const targetZ = 14.0 + (p - 0.5) * 1.15;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 5, 0.016);

    // Subtle desktop mouse parallax on camera
    if (mouseRef && mouseRef.current && !isMobile) {
      const targetCamX = mouseRef.current.x * 0.7;
      const targetCamY = mouseRef.current.y * 0.45;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4, 0.016);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, 0.016);
    }
    camera.lookAt(0, 0, 0);

    // Slow idle rotation of the whole bloom group ONLY when T = 0, driven by scroll
    if (groupRef.current) {
      if (T === 0) {
        groupRef.current.rotation.z = p * 1.2;
      } else {
        groupRef.current.rotation.z = 0;
      }
    }

    const mesh = instancedMeshRef.current;

    for (let i = 0; i < count; i++) {
      const petal = petalData[i];

      // Delay mapping: easeInOutCubic(clamp((T - delay) / (1 - 0.35), 0, 1))
      const kRaw = (T - petal.delay) / (1.0 - 0.35);
      const kClamped = Math.min(1, Math.max(0, kRaw));
      const k = easeInOutCubic(kClamped);

      // Sway: (sin(T*7*f1 + ph1), cos(T*6*f2 + ph2), sin(T*5*f3 + ph3)) * 0.6 * sin(k * PI)
      const swayFactor = 0.6 * Math.sin(k * Math.PI);
      const swayX = Math.sin(T * 7 * petal.f1 + petal.ph1) * swayFactor;
      const swayY = Math.cos(T * 6 * petal.f2 + petal.ph2) * swayFactor;
      const swayZ = Math.sin(T * 5 * petal.f3 + petal.ph3) * swayFactor;

      // Position = home + dir * dist * k + sway
      dummy.position.set(
        petal.homePos.x + petal.dir.x * petal.dist * k + swayX,
        petal.homePos.y + petal.dir.y * petal.dist * k + swayY,
        petal.homePos.z + petal.dir.z * petal.dist * k + swayZ
      );

      // Rotation = homeRotation, then rotate by spinSpeed * k * 9 radians around spinAxis
      const spinAngle = petal.spinSpeed * k * 9.0;
      spinQuat.setFromAxisAngle(petal.spinAxis, spinAngle);
      dummy.quaternion.copy(petal.homeQuat).multiply(spinQuat);

      // Scale = 1 (do not shrink)
      dummy.scale.set(1, 1, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* ── Lighting (Strict Specification) ── */}
      {/* Low ambientLight (0.35) */}
      <ambientLight intensity={0.35} />

      {/* Warm directional light (#ffd9a0, intensity 2.2) from top-left */}
      <directionalLight position={[-7, 8, 8]} color="#ffd9a0" intensity={2.2} />

      {/* Faint cyan (#00d4ff) directional rim light from behind (intensity 0.6) */}
      <directionalLight position={[5, -4, -6]} color="#00d4ff" intensity={0.6} />

      {/* ── Main Bloom Group (Centered at ~30% from the top of viewport) ── */}
      <group ref={groupRef} position={[0, 1.9, 0]}>
        <instancedMesh
          ref={instancedMeshRef}
          args={[petalGeometry, petalMaterial, count]}
          frustumCulled={false}
        />
      </group>
    </>
  );
}
