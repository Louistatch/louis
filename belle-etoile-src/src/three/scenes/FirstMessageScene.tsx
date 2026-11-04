import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useJourney } from '../../state/journeyStore';
import { COLORS, damp, Fireflies, Float, Glow, Label, pointerProps, StarPoint } from '../common';
import { Hills } from './IntroScene';

function bubbleGeometry() {
  const w = 2.6, h = 1.3, r = 0.45;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(-0.5, -h / 2);
  s.lineTo(-0.85, -h / 2 - 0.45); // petite queue de bulle
  s.lineTo(-0.95, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3, curveSegments: 10 });
  g.center();
  return g;
}

export default function FirstMessageScene() {
  const lit = useJourney((s) => (s.revealed[1] ?? []).includes('first-star'));
  const reveal = useJourney((s) => s.reveal);
  const geo = useMemo(bubbleGeometry, []);
  const star = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!star.current) return;
    const k = damp(star.current.scale.x, lit ? 1 : 0.001, 3, dt);
    star.current.scale.setScalar(k);
  });
  return (
    <group>
      <Hills color="#121941" z={-20} seed={1.1} height={3.6} />
      <Hills color="#090e28" z={-12} seed={2.4} height={1.8} />
      <Float amp={0.12} speed={0.9} rot={0.15}>
        <group position={[0, 1.2, 0]} onClick={(e) => { e.stopPropagation(); reveal(1, 'first-star'); }} {...pointerProps}>
          <mesh geometry={geo}>
            <meshStandardMaterial color={COLORS.cream} roughness={0.35} metalness={0.05} emissive="#3a2a18" emissiveIntensity={0.25} />
          </mesh>
          <Label text="Hello 👋" position={[0, 0, 0.25]} height={0.62} opts={{ color: '#1b2456', font: '700 64px Georgia, serif' }} />
        </group>
      </Float>
      <group ref={star} position={[2.4, 4.2, -4]} scale={0.001}>
        <StarPoint size={2.2} />
        <Glow size={6} opacity={0.25} />
      </group>
      {!lit && <Glow position={[0, 1.2, -0.3]} size={4.5} opacity={0.18} pulse={0.12} color={COLORS.rose} />}
      <Fireflies count={18} area={[10, 3, 5]} y={-0.5} />
    </group>
  );
}
