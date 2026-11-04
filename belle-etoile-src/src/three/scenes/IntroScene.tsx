import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS, Fireflies, Float, StarPoint } from '../common';

/** Silhouettes de collines (évoque les reliefs de Kara, sans lieu exact). */
export function Hills({ color = '#0b1230', z = -14, seed = 1, height = 3.2, width = 60 }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, -4);
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const x = -width / 2 + (width * i) / n;
      const y =
        Math.sin(i * 0.37 * seed + seed) * height * 0.45 +
        Math.sin(i * 0.11 * seed + 2) * height * 0.55 +
        Math.sin(i * 1.3 + seed) * 0.15;
      s.lineTo(x, Math.max(-0.5, y));
    }
    s.lineTo(width / 2, -4);
    return new THREE.ShapeGeometry(s);
  }, [seed, height, width]);
  return (
    <mesh geometry={geo} position={[0, 0, z]}>
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function IntroScene() {
  return (
    <group>
      <Hills color="#2a2350" z={-26} seed={0.7} height={4.5} />
      <Hills color="#171a42" z={-18} seed={1.3} height={3} />
      <Hills color="#070b1f" z={-10} seed={2.1} height={1.6} />
      <Float amp={0.15} speed={0.6}>
        <StarPoint position={[0, 4.2, -8]} size={3.2} color={COLORS.gold} pulse={0.06} />
      </Float>
      <Fireflies count={24} area={[14, 3, 6]} y={-0.4} />
    </group>
  );
}
