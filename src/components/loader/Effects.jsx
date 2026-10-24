import React, { useMemo } from 'react';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import * as THREE from 'three';

export function Effects() {
  // Disable chromatic aberration & noise on mobile for maximum 60fps performance
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {/* Subtle Controlled Bloom for Emissive Chip Core and Cyan Halos */}
      <Bloom
        luminanceThreshold={0.65}
        luminanceSmoothing={0.75}
        intensity={0.75}
        mipmapBlur
      />

      {/* Deep Space Vignette */}
      <Vignette eskil={false} offset={0.15} darkness={0.88} />

      {/* Chromatic Aberration & Grain (Desktop only) */}
      {!isMobile && (
        <>
          <ChromaticAberration
            offset={new THREE.Vector2(0.0012, 0.0012)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.025} />
        </>
      )}
    </EffectComposer>
  );
}

export default Effects;
