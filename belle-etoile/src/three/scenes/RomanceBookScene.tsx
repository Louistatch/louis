import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { checkpoints } from '../../content/story.fr';
import { useJourney } from '../../state/journeyStore';
import { COLORS, damp, Fireflies, Float, Glow, pointerProps } from '../common';
import { textTexture } from '../textures';

const W = 1.5, H = 2.0;
const pages = checkpoints[1].reveals!;

function pageTex(title: string, text: string, cover = false) {
  return textTexture(text, {
    width: 600,
    height: 800,
    padding: 56,
    title,
    bg: cover ? '#7a1f35' : '#fbf3e4',
    color: cover ? '#f6dfb0' : '#3a2c22',
    titleColor: cover ? '#f2c97d' : '#7a1f35',
    font: cover ? 'italic 34px Georgia, serif' : '34px Georgia, serif',
    titleFont: '700 46px Georgia, serif',
    lineHeight: 48,
  }).tex;
}

/** Une feuille pivotant autour de la reliure (x = 0). */
function Leaf({ index, front, back, flipped, total }: { index: number; front: THREE.Texture; back: THREE.Texture; flipped: boolean; total: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y = damp(ref.current.rotation.y, flipped ? -Math.PI + 0.04 * index : -0.02 * index, 4, dt);
  });
  const z = (total - index) * 0.012;
  return (
    <group ref={ref} position={[0, 0, z]}>
      <mesh position={[W / 2, 0, 0.002]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={front} roughness={0.9} />
      </mesh>
      <mesh position={[W / 2, 0, -0.002]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={back} roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function RomanceBookScene() {
  const count = useJourney((s) => (s.revealed[2] ?? []).length);
  const revealNext = useJourney((s) => s.revealNext);
  const tex = useMemo(
    () => ({
      cover: pageTex('Le livre de romantisme de Louis', '\n\n\nTome 1\nNe pas juger le titre.', true),
      blank: pageTex('', '\n\n\n\n\n✦', false),
      p: pages.map((p) => pageTex(p.title, p.text)),
      last: pageTex('La suite…', 'Elle s’écrit avec le temps, page après page.'),
    }),
    [],
  );
  const leaves = [
    { front: tex.cover, back: tex.blank },
    { front: tex.p[0], back: tex.blank },
    { front: tex.p[1], back: tex.blank },
    { front: tex.p[2], back: tex.blank },
  ];
  return (
    <group>
      <Float amp={0.06} speed={0.7}>
        <group
          position={[-0.1, 1.1, 0]}
          rotation={[-0.35, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            revealNext(2);
          }}
          {...pointerProps}
        >
          {/* plat arrière + dos */}
          <mesh position={[W / 2, 0, -0.03]}>
            <boxGeometry args={[W + 0.08, H + 0.08, 0.04]} />
            <meshStandardMaterial color="#5e1528" roughness={0.6} />
          </mesh>
          <mesh position={[W / 2, 0, 0.0]}>
            <planeGeometry args={[W, H]} />
            <meshStandardMaterial map={tex.last} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.05, 0.05, H + 0.08, 12]} />
            <meshStandardMaterial color={COLORS.goldDeep} metalness={0.6} roughness={0.35} />
          </mesh>
          {leaves.map((l, i) => (
            <Leaf key={i} index={i} front={l.front} back={l.back} flipped={i < count} total={leaves.length} />
          ))}
        </group>
      </Float>
      {/* table */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#2b1c1a" roughness={0.8} />
      </mesh>
      <Glow position={[0.7, 1.1, -0.4]} size={4} opacity={0.22} color={COLORS.warm} />
      <Fireflies count={14} area={[6, 2.5, 4]} y={0} color="#ffcf8a" />
    </group>
  );
}
