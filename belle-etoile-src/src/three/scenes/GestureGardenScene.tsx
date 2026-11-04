import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { checkpoints } from '../../content/story.fr';
import { useJourney } from '../../state/journeyStore';
import { budget, useSettings } from '../../state/settings';
import { COLORS, damp, Fireflies, Glow, Label, pointerProps } from '../common';

const items = checkpoints[2].reveals!;
const spots: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, -0.8],
  [1.5, 0, 0.5],
];

function Grass({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 1 + Math.random() * 6.5;
      const a = Math.random() * Math.PI * 2;
      const s = 0.5 + Math.random() * 0.9;
      q.setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.4, a, (Math.random() - 0.5) * 0.4));
      m.compose(new THREE.Vector3(Math.cos(a) * r, 0.12 * s, Math.sin(a) * r), q, new THREE.Vector3(s, s, s));
      ref.current!.setMatrixAt(i, m);
      ref.current!.setColorAt(i, c.setHSL(0.27 + Math.random() * 0.06, 0.45, 0.18 + Math.random() * 0.12));
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.05, 0.4, 3]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  );
}

function Lantern({ pos, lit, title, onTap }: { pos: [number, number, number]; lit: boolean; title: string; onTap: () => void }) {
  const glass = useRef<THREE.MeshStandardMaterial>(null);
  const body = useRef<THREE.Group>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  useFrame(({ clock }, dt) => {
    if (glass.current) glass.current.emissiveIntensity = damp(glass.current.emissiveIntensity, lit ? 2.4 : 0.25, 3, dt);
    if (body.current && !reduce) body.current.rotation.z = Math.sin(clock.elapsedTime * 1.2 + pos[0]) * 0.04;
  });
  return (
    <group position={pos}>
      {/* poteau */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 1.6, 8]} />
        <meshStandardMaterial color="#2a2018" roughness={0.7} metalness={0.3} />
      </mesh>
      <group ref={body} position={[0, 1.55, 0]} onClick={(e) => { e.stopPropagation(); onTap(); }} {...pointerProps}>
        {/* zone tactile large (invisible) */}
        <mesh visible={false}>
          <sphereGeometry args={[0.7, 8, 8]} />
          <meshBasicMaterial />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.26, 0.5, 8]} />
          <meshStandardMaterial ref={glass} color="#ffe6b0" emissive="#ffb347" emissiveIntensity={0.25} transparent opacity={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <coneGeometry args={[0.3, 0.22, 8]} />
          <meshStandardMaterial color="#3b2a1a" metalness={0.5} roughness={0.4} />
        </mesh>
        <Glow position={[0, -0.3, 0]} size={lit ? 2.4 : 0.9} opacity={lit ? 0.9 : 0.35} pulse={lit ? 0.05 : 0.15} color="#ffb85c" />
      </group>
      {lit && <Label text={title} position={[0, 2.3 + (pos[2] < 0 ? 0.45 : 0), 0]} height={0.42} opts={{ width: 460, bg: 'rgba(16,26,68,0.82)', font: '600 44px system-ui, sans-serif', color: '#fff4e0', padding: 20 }} />}
    </group>
  );
}

export default function GestureGardenScene() {
  const revealed = useJourney((s) => s.revealed[3] ?? []);
  const reveal = useJourney((s) => s.reveal);
  const q = useSettings((s) => s.effective);
  const b = budget(q);
  const bushes = useMemo(
    () => Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 + 0.3;
      return { p: [Math.cos(a) * 5, 0.3, Math.sin(a) * 4 - 1.5] as [number, number, number], s: 0.5 + ((i * 37) % 10) / 14 };
    }),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color="#1c2a1c" roughness={1} />
      </mesh>
      {/* allée de pierres */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[Math.sin(i * 0.6) * 0.3, 0.02, 4 - i * 0.75]} rotation={[-Math.PI / 2, 0, i]}>
          <circleGeometry args={[0.26, 7]} />
          <meshStandardMaterial color="#6d6458" roughness={0.9} />
        </mesh>
      ))}
      <Grass count={b.grass} />
      {bushes.map((x, i) => (
        <mesh key={i} position={x.p} scale={x.s}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color={i % 3 ? '#21442a' : '#2e5234'} roughness={1} flatShading />
        </mesh>
      ))}
      {/* fleurs roses discrètes */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={'f' + i} position={[Math.cos(i * 2.1) * (2.5 + (i % 4)), 0.18, Math.sin(i * 2.1) * (2 + (i % 3)) - 0.5]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color={i % 2 ? COLORS.rose : COLORS.cream} emissive={COLORS.rose} emissiveIntensity={0.2} />
        </mesh>
      ))}
      {items.map((it, i) => (
        <Lantern key={it.id} pos={spots[i]} lit={revealed.includes(it.id)} title={it.title} onTap={() => reveal(3, it.id)} />
      ))}
      <Fireflies count={b.fireflies} area={[12, 2.5, 8]} y={0.3} />
    </group>
  );
}
