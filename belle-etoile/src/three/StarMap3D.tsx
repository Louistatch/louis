import { useMemo } from 'react';
import * as THREE from 'three';
import { checkpoints, type CheckpointId } from '../content/story.fr';
import { isUnlocked } from '../state/journey';
import { useJourney } from '../state/journeyStore';
import { COLORS, Glow, Label, pointerProps, StarPoint } from './common';

/** Disposition des 8 nœuds : une constellation qui monte en serpentant. */
export const NODE_POSITIONS: [number, number, number][] = [
  [-2.6, -2.2, 0],
  [-0.9, -1.7, 0.4],
  [-2.0, -0.4, -0.3],
  [-0.2, 0.2, 0.2],
  [1.7, -0.6, -0.2],
  [2.4, 1.0, 0.3],
  [0.6, 1.9, -0.2],
  [1.4, 3.3, 0.3],
];

export default function StarMap3D() {
  const s = useJourney();
  const goTo = useJourney((x) => x.goTo);
  const lines = useMemo(() => {
    const done = new THREE.BufferGeometry();
    const todo = new THREE.BufferGeometry();
    const a: number[] = [];
    const b: number[] = [];
    for (let i = 0; i < 7; i++) {
      const seg = [...NODE_POSITIONS[i], ...NODE_POSITIONS[i + 1]];
      (s.visited.includes((i + 2) as CheckpointId) ? a : b).push(...seg);
    }
    done.setAttribute('position', new THREE.Float32BufferAttribute(a, 3));
    todo.setAttribute('position', new THREE.Float32BufferAttribute(b, 3));
    return { done, todo };
  }, [s.visited]);
  return (
    <group position={[0, 1.6, -3]}>
      <lineSegments geometry={lines.done}>
        <lineBasicMaterial color={COLORS.gold} />
      </lineSegments>
      <lineSegments geometry={lines.todo}>
        <lineBasicMaterial color="#4a5788" transparent opacity={0.6} />
      </lineSegments>
      {checkpoints.map((c, i) => {
        const visited = s.visited.includes(c.id);
        const open = isUnlocked(s, c.id);
        const current = s.current === c.id;
        return (
          <group
            key={c.id}
            position={NODE_POSITIONS[i]}
            onClick={(e) => {
              e.stopPropagation();
              if (open) goTo(c.id);
            }}
            {...pointerProps}
          >
            <mesh visible={false}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial />
            </mesh>
            <StarPoint size={visited ? 1.4 : open ? 1.1 : 0.8} lit={open} pulse={current ? 0.12 : open && !visited ? 0.08 : 0.02} />
            {current && <Glow size={2.4} opacity={0.35} color={COLORS.rose} pulse={0.1} />}
            <Label
              text={`${c.id}. ${open ? c.node : '•••'}`}
              position={[0, -0.42, 0]}
              height={0.28}
              opts={{ font: '600 40px system-ui, sans-serif', color: visited ? '#fff4e0' : open ? '#f2c97d' : '#6f7aa3' }}
            />
          </group>
        );
      })}
    </group>
  );
}
