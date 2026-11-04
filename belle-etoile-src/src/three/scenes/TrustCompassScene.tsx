import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { checkpoints } from '../../content/story.fr';
import { useJourney } from '../../state/journeyStore';
import { COLORS, damp, Fireflies, Label, pointerProps, StarPoint } from '../common';

const items = checkpoints[5].reveals!;
// Nord, Est, Sud, Ouest
const angles = [Math.PI / 2, 0, -Math.PI / 2, Math.PI];
const R = 2.1;

export default function TrustCompassScene() {
  const revealed = useJourney((s) => s.revealed[6] ?? []);
  const reveal = useJourney((s) => s.reveal);
  const needle = useRef<THREE.Group>(null);
  const last = revealed.length ? items.findIndex((i) => i.id === revealed[revealed.length - 1]) : 0;
  useFrame(({ clock }, dt) => {
    if (!needle.current) return;
    const target = angles[last] - Math.PI / 2 + (revealed.length ? 0 : Math.sin(clock.elapsedTime) * 0.4);
    needle.current.rotation.z = damp(needle.current.rotation.z, target, 3, dt);
  });
  const ticks = useMemo(() => Array.from({ length: 32 }, (_, i) => (i / 32) * Math.PI * 2), []);
  const lines = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    const lit = items.map((it, i) => (revealed.includes(it.id) ? i : -1)).filter((i) => i >= 0);
    // relie chaque étoile allumée au centre et à la suivante allumée
    lit.forEach((i, k) => {
      const a = [Math.cos(angles[i]) * R, Math.sin(angles[i]) * R, 0.05];
      pts.push(0, 0, 0.05, ...a);
      if (k > 0) {
        const j = lit[k - 1];
        pts.push(Math.cos(angles[j]) * R, Math.sin(angles[j]) * R, 0.05, ...a);
      }
    });
    if (lit.length === 4) pts.push(Math.cos(angles[lit[3]]) * R, Math.sin(angles[lit[3]]) * R, 0.05, Math.cos(angles[lit[0]]) * R, Math.sin(angles[lit[0]]) * R, 0.05);
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [revealed]);
  return (
    <group position={[0, 1.5, 0]} rotation={[-0.25, 0, 0]}>
      {/* disque de la boussole */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.06]}>
        <cylinderGeometry args={[2.6, 2.6, 0.1, 64]} />
        <meshStandardMaterial color="#141d45" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh>
        <torusGeometry args={[2.6, 0.07, 10, 80]} />
        <meshStandardMaterial color={COLORS.gold} metalness={0.85} roughness={0.25} emissive={COLORS.goldDeep} emissiveIntensity={0.3} />
      </mesh>
      {ticks.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 2.42, Math.sin(a) * 2.42, 0.01]} rotation={[0, 0, a]}>
          <planeGeometry args={[i % 8 === 0 ? 0.22 : 0.1, 0.025]} />
          <meshBasicMaterial color={COLORS.cream} transparent opacity={0.7} />
        </mesh>
      ))}
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.85} />
      </lineSegments>
      <group ref={needle}>
        <mesh position={[0, 0.7, 0.06]}>
          <coneGeometry args={[0.13, 1.4, 4]} />
          <meshStandardMaterial color={COLORS.rose} emissive={COLORS.rose} emissiveIntensity={0.5} metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.6, 0.06]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.11, 1.2, 4]} />
          <meshStandardMaterial color={COLORS.cream} metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.12]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={COLORS.gold} metalness={0.9} roughness={0.2} />
      </mesh>
      <Label text="Confiance" position={[0, -1.25, 0.08]} height={0.26} opts={{ font: 'italic 600 40px Georgia, serif', color: '#f2c97d' }} />
      {items.map((it, i) => {
        const lit = revealed.includes(it.id);
        const p: [number, number, number] = [Math.cos(angles[i]) * R, Math.sin(angles[i]) * R, 0.15];
        return (
          <group key={it.id} position={p} onClick={(e) => { e.stopPropagation(); reveal(6, it.id); }} {...pointerProps}>
            <mesh visible={false}>
              <sphereGeometry args={[0.55, 8, 8]} />
              <meshBasicMaterial />
            </mesh>
            <StarPoint size={lit ? 1.5 : 1} lit={lit} pulse={lit ? 0.05 : 0} />
            <Label text={it.title} position={[0, i === 2 ? -0.55 : 0.55, 0.05]} height={0.3} opts={{ font: '600 40px system-ui, sans-serif', color: lit ? '#fff4e0' : '#9aa3c7' }} />
          </group>
        );
      })}
      <Fireflies count={14} area={[7, 4, 2]} y={-2} color="#cfd8ff" />
    </group>
  );
}
