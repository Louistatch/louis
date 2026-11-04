import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../state/settings';
import { COLORS, Fireflies, Glow, StarPoint } from '../common';

// Chiffres en grille 3×5 pour dessiner « 2027 » avec des étoiles.
const DIGITS: Record<string, string[]> = {
  '2': ['###', '..#', '###', '#..', '###'],
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '7': ['###', '..#', '.#.', '.#.', '.#.'],
};

function Constellation2027() {
  const pts = useMemo(() => {
    const out: [number, number, number][] = [];
    '2027'.split('').forEach((d, k) => {
      DIGITS[d].forEach((row, r) =>
        row.split('').forEach((c, col) => {
          if (c === '#') out.push([(k - 1.5) * 1.5 + (col - 1) * 0.38, 7.2 - r * 0.38, -9]);
        }),
      );
    });
    return out;
  }, []);
  return (
    <group>
      {pts.map((p, i) => (
        <StarPoint key={i} position={p} size={0.55} pulse={0.03} />
      ))}
    </group>
  );
}

function Silhouette({ x, tone }: { x: number; tone: string }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.18, 0.75, 4, 10]} />
        <meshStandardMaterial color={tone} roughness={0.7} emissive="#2a2040" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={tone} roughness={0.7} emissive="#2a2040" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Walkers() {
  const ref = useRef<THREE.Group>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reduce ? 0.35 : (clock.elapsedTime * 0.045) % 1;
    ref.current.position.z = 2.2 - t * 6.5;
    ref.current.position.y = reduce ? 0 : Math.abs(Math.sin(clock.elapsedTime * 3.2)) * 0.02;
  });
  return (
    <group ref={ref}>
      <Silhouette x={-0.26} tone="#1b1f3a" />
      <Silhouette x={0.26} tone="#24203d" />
    </group>
  );
}

function LampPosts() {
  const posts = Array.from({ length: 6 }, (_, i) => i);
  return (
    <group>
      {posts.map((i) =>
        [-1.3, 1.3].map((x) => (
          <group key={i + ':' + x} position={[x, 0, 3 - i * 2]}>
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 1.8, 6]} />
              <meshStandardMaterial color="#1e1a2a" metalness={0.5} roughness={0.5} />
            </mesh>
            <Glow position={[0, 1.85, 0]} size={1.1} color="#ffd28a" opacity={0.95} />
          </group>
        )),
      )}
    </group>
  );
}

function TableForTwo() {
  return (
    <group position={[2.8, 0, -1.2]} rotation={[0, -0.6, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 24]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.72, 8]} />
        <meshStandardMaterial color="#2a2236" />
      </mesh>
      {[-0.75, 0.75].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <meshStandardMaterial color="#3b2a2a" />
          </mesh>
          <mesh position={[x > 0 ? 0.18 : -0.18, 0.7, 0]}>
            <boxGeometry args={[0.05, 0.5, 0.4]} />
            <meshStandardMaterial color="#3b2a2a" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
        <meshStandardMaterial color="#fff" emissive="#ffcc88" emissiveIntensity={0.6} />
      </mesh>
      <Glow position={[0, 0.92, 0]} size={0.9} color="#ffb866" pulse={0.12} />
    </group>
  );
}

export default function Future2027Scene() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial color="#141633" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]}>
        <planeGeometry args={[1.6, 14]} />
        <meshStandardMaterial color="#2e2a4a" emissive="#3d2f3a" emissiveIntensity={0.5} roughness={0.8} />
      </mesh>
      <LampPosts />
      <Walkers />
      <TableForTwo />
      {/* arche lumineuse à l'horizon : un jour de célébration possible */}
      <group position={[0, 0, -8.5]}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.8, 0.06, 10, 64, Math.PI]} />
          <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={1.4} />
        </mesh>
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 10) * Math.PI;
          return <Glow key={i} position={[Math.cos(a) * 1.8, Math.sin(a) * 1.8, 0.05]} size={0.6} color="#ffe2a8" pulse={0.08} />;
        })}
        <Glow position={[0, 0.9, -0.3]} size={5} opacity={0.18} color={COLORS.rose} />
      </group>
      <Constellation2027 />
      <Fireflies count={26} area={[10, 2.5, 12]} y={0.3} />
    </group>
  );
}
