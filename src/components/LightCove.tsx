import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface LightCoveProps {
  className?: string;
}

export const LightCove: React.FC<LightCoveProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // ── 1. Three.js Scene Setup ──
    const scene = new THREE.Scene();

    // Camera: Looking down into the cove
    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      100
    );
    camera.position.set(0, 3.2, 14.5);
    camera.lookAt(0, 1.0, -1.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x05070b, 1.0);

    // ── 2. Create the 3D Cyclorama Cove Geometry ──
    // A continuous mesh that flows from horizontal floor -> curved cove -> vertical wall
    const width = 36.0;
    const xSegments = 64;
    const ySegments = 120;

    // Parameters for cove profile
    // Floor: Z from +12 to 0, Y = -3.5
    // Cove fillet: radius R = 3.5, curving from Z=0, Y=-3.5 to Z=-3.5, Y=0.0
    // Wall: Z = -3.5, Y from 0.0 to +11.5
    const R = 3.5;
    const floorZLength = 12.0;
    const wallYLength = 11.5;
    const coveArcLength = (Math.PI / 2) * R;
    const totalLength = floorZLength + coveArcLength + wallYLength;

    const floorFrac = floorZLength / totalLength; // ~ 0.44
    const coveFrac = coveArcLength / totalLength;   // ~ 0.20
    const wallFrac = wallYLength / totalLength;    // ~ 0.36

    const geometry = new THREE.PlaneGeometry(width, 1, xSegments, ySegments);
    const posAttr = geometry.attributes.position;
    const uvAttr = geometry.attributes.uv;

    for (let i = 0; i < posAttr.count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i); // 0 at floor front, 1 at top of wall

      const x = (u - 0.5) * width;
      let y = 0;
      let z = 0;

      if (v < floorFrac) {
        // Floor section: horizontal
        const localT = v / floorFrac; // 0 to 1
        z = floorZLength * (1.0 - localT);
        y = -R;
      } else if (v < floorFrac + coveFrac) {
        // Cove fillet: circular arc of 90 degrees
        const localT = (v - floorFrac) / coveFrac; // 0 to 1
        const theta = localT * (Math.PI / 2);
        z = -R * Math.sin(theta);
        y = -R + R * (1.0 - Math.cos(theta));
      } else {
        // Wall section: vertical
        const localT = (v - floorFrac - coveFrac) / wallFrac; // 0 to 1
        z = -R;
        y = localT * wallYLength;
      }

      posAttr.setXYZ(i, x, y, z);
    }

    geometry.computeVertexNormals();

    // ── 3. Custom GLSL Shader for the "Lanes of Light" & Bloom ──
    const customUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
    };

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec3 vViewPos;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const fragmentShader = `
      precision highp float;

      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec3 vViewPos;

      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;

      // Hash function for pseudo-random variations per lane
      float hash(float n) {
        return fract(sin(n) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        float u = uv.x;
        float v = uv.y;

        // Interactive mouse parallax shift on lane coordinates
        float mouseShift = uMouse.x * 0.035 * (1.0 - v * 0.5);
        u += mouseShift;

        // Palette definitions: Cool blues/whites + Portfolio signature gold/tan
        vec3 colCoreWhite  = vec3(1.0, 1.0, 1.0);
        vec3 colElectric   = vec3(0.0, 0.83, 1.0); // #00d4ff cyan
        vec3 colSky        = vec3(0.22, 0.74, 0.97); // #38bdf8 sky blue
        vec3 colIce        = vec3(0.85, 0.95, 1.0); // bright icy tint
        vec3 colGold       = vec3(0.91, 0.72, 0.43); // #e8b86d signature gold
        vec3 colTan        = vec3(0.77, 0.66, 0.50); // #c5a880 warm tan
        vec3 colAmberGlow  = vec3(0.98, 0.60, 0.22); // deep amber highlight
        vec3 colDeepSpace  = vec3(0.02, 0.027, 0.043); // #05070b background

        // Base background fill
        vec3 finalColor = colDeepSpace;

        // ── 22 Distinct Lanes of Light ──
        // Varied positions across the cove with distinct widths, colors, and pulse timings
        const int NUM_LANES = 22;
        
        for (int i = 0; i < NUM_LANES; i++) {
          float fi = float(i);
          float laneSeed = hash(fi * 13.17);
          
          // Normalized lane center across u (0.06 to 0.94)
          float center = 0.06 + (fi / float(NUM_LANES - 1)) * 0.88;
          // Organic irregularity
          center += (hash(fi * 7.91) - 0.5) * 0.024;

          // Color assignment: Rhythm of Cyan/Blue, White, and Signature Gold/Tan
          vec3 laneColor;
          vec3 laneCore = colCoreWhite;
          float type = mod(fi, 5.0);

          if (type == 0.0) {
            laneColor = colGold;
          } else if (type == 1.0) {
            laneColor = colElectric;
          } else if (type == 2.0) {
            laneColor = colTan;
          } else if (type == 3.0) {
            laneColor = colSky;
          } else {
            // Mixed gold/ice-white core
            laneColor = mix(colGold, colIce, 0.5);
          }

          // Special center focal lanes get intensified
          bool isCenterFocal = (i == 10 || i == 11);
          float focalBoost = isCenterFocal ? 1.45 : 1.0;

          // Width variations
          float baseWidth = 0.0035 + hash(fi * 23.41) * 0.003;
          if (isCenterFocal) baseWidth *= 1.3;

          // Perspective floor broadening: lanes naturally spread as they race forward toward viewer
          float floorBroaden = 1.0;
          if (v < 0.44) {
            floorBroaden = 1.0 + pow((0.44 - v) / 0.44, 1.4) * 1.5;
          }
          float width = baseWidth * floorBroaden;

          // Distance from lane center
          float dist = abs(u - center);

          // ── Traveling Pulses & Downward Flow ──
          // Speed variations: some lanes flow rapidly, others steadily
          float speed = 0.55 + hash(fi * 31.7) * 0.45;
          float flowTime = uTime * speed;

          // High-intensity traveling light pulses along the vertical wall & cove
          float pulsePhase1 = fract(v * 1.4 - flowTime * 0.9 + laneSeed * 5.3);
          float pulse1 = exp(-pow(pulsePhase1 - 0.5, 2.0) * 55.0) * 1.6;

          // Secondary subtle continuous rhythm wave
          float pulsePhase2 = sin(v * 18.0 - flowTime * 2.4 + laneSeed * 6.28) * 0.5 + 0.5;
          float pulse2 = pow(pulsePhase2, 3.0) * 0.6;

          // Combined pulse intensity
          float pulseIntensity = 0.45 + pulse1 + pulse2;

          // ── Core, Inner Bloom, and Diffuse Ambient Glow ──
          // Core: ultra-bright laser-white line
          float core = exp(-dist / (width * 0.35)) * 1.8;
          // Inner glow: rich vibrant saturated color
          float inner = exp(-dist / (width * 1.4)) * 1.1;
          // Outer bloom: wide soft halo
          float outer = exp(-dist / (width * 5.2)) * 0.35;
          // Wide atmospheric wash
          float wideWash = exp(-dist / (width * 14.0)) * 0.12;

          // Compose the lane light
          vec3 laneRadiance = 
            (core * laneCore) +
            (inner * laneColor) +
            (outer * mix(laneColor, colAmberGlow, 0.2)) +
            (wideWash * laneColor);

          laneRadiance *= pulseIntensity * focalBoost;

          // ── Cove Bend & Floor Specular Flare ──
          // In the cove curve (v ~ 0.44 to 0.64), light wraps around the curvature,
          // creating a luminous horizontal compression band
          float coveGaze = 1.0 + exp(-pow((v - 0.54) * 8.0, 2.0)) * 0.6;
          laneRadiance *= coveGaze;

          // On the mirrored floor (v < 0.44):
          // Add glossy floor specular reflection trails
          if (v < 0.44) {
            float floorDepth = (0.44 - v) / 0.44; // 0 at cove, 1 at front edge
            // Specular reflection streak
            float floorSpec = exp(-dist / (width * 1.8)) * pow(1.0 - floorDepth * 0.3, 1.5);
            laneRadiance += floorSpec * laneColor * 0.4 * (1.0 + pulse1 * 0.5);
          }

          finalColor += laneRadiance;
        }

        // ── Mirrored Floor Horizon Polish & Specular Gradient ──
        // A subtle soft horizontal specular sheen along the cove bend line
        float coveSheen = exp(-pow((v - 0.52) * 12.0, 2.0)) * 0.22;
        finalColor += mix(colGold, colElectric, sin(u * 8.0 + uTime * 0.5) * 0.5 + 0.5) * coveSheen;

        // Ambient dark blue-black floor reflection depth
        if (v < 0.44) {
          float floorGrad = (0.44 - v) / 0.44;
          finalColor = mix(finalColor, colDeepSpace, floorGrad * 0.32);
        }

        // ── Outer Boundary Vignette (Seamless Blending into #05070b) ──
        // Softly fade to deep black at top, bottom, and left/right sides
        float xFade = smoothstep(0.0, 0.14, u) * smoothstep(1.0, 0.86, u);
        float yFade = smoothstep(0.0, 0.08, v) * smoothstep(1.0, 0.90, v);
        float edgeVignette = xFade * yFade;

        finalColor = mix(colDeepSpace, finalColor, edgeVignette);

        // Subtle filmic tone mapping & contrast
        finalColor = finalColor / (finalColor + vec3(0.85));
        finalColor = pow(finalColor, vec3(0.92));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: customUniforms,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    const coveMesh = new THREE.Mesh(geometry, material);
    scene.add(coveMesh);

    // ── 4. Mouse Move Tracking for Interactive 3D Parallax ──
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = Math.max(-1, Math.min(1, x));
      targetMouseY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── 5. Resize Handling ──
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      customUniforms.uResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // ── 6. Animation Loop & Performance Throttling via IntersectionObserver ──
    let isVisible = true;
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      customUniforms.uTime.value = elapsedTime;
      customUniforms.uMouse.value.set(currentMouseX, currentMouseY);

      // Subtle 3D camera parallax tilt
      camera.position.x = currentMouseX * 0.8;
      camera.position.y = 3.2 + currentMouseY * 0.4;
      camera.lookAt(currentMouseX * 0.2, 1.0, -1.0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver: automatically pauses rendering when scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            clock.start();
            render();
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );

    intersectionObserver.observe(container);

    // Initial start
    render();

    // ── 7. Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default LightCove;
