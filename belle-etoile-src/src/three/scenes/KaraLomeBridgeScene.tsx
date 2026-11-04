import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useJourney } from '../../state/journeyStore';
import { budget, useSettings } from '../../state/settings';
import { COLORS, damp, Fireflies, Glow, Label, pointerProps } from '../common';

const GAP = 7; // distance entre les deux rives

/** Rive de Kara : plateau et collines. */
function Kara({ onTap }: { onTap: () => void }) {
  return (
    <group position={[-GAP / 2 - 2.2, 0, 0]} onClick={(e) => { e.stopPropagation(); onTap(); }} {...pointerProps}>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.6, 3, 1.4, 9]} />
        <meshStandardMaterial color="#5a3b28" roughness={1} flatShading />
      </mesh>
      {[[-1, 0.6, -0.8, 1.4], [0.6, 0.4, -1.2, 1.1], [-0.2, 0.3, 0.9, 0.7]].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s, s * 0.8, s]}>
          <coneGeometry args={[1, 1.4, 7]} />
          <meshStandardMaterial color={i % 2 ? '#2f5a33' : '#3d6b3a'} roughness={1} flatShading />
        </mesh>
      ))}
      {/* maisons aux toits de tôle */}
      {[[1.2, 0.6], [0.5, 1.4], [1.6, -0.3]].map(([x, z], i) => (
        <group key={i} position={[x, 0.25, z]}>
          <mesh>
            <boxGeometry args={[0.5, 0.4, 0.45]} />
            <meshStandardMaterial color="#c9a27a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.27, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.06, 0.55]} />
            <meshStandardMaterial color="#8f9aa6" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.23]}>
            <planeGeometry args={[0.12, 0.14]} />
            <meshBasicMaterial color="#ffcf7a" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <Label text="Kara" position={[0, 2.2, 0]} height={1.0} opts={{ font: "700 72px Georgia, serif", color: '#fff4e0' }} />
    </group>
  );
}

function Palm({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.05, 0.08, 1.4, 6]} />
        <meshStandardMaterial color="#6b4a2f" roughness={1} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0.08, 1.42, 0]} rotation={[0.9, (i / 6) * Math.PI * 2, 0]}>
          <coneGeometry args={[0.12, 0.9, 3]} />
          <meshStandardMaterial color="#2f6b3c" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Rive de Lomé : ville basse, fenêtres allumées, palmiers, front de mer. */
function Lome({ onTap }: { onTap: () => void }) {
  const blocks = useMemo(
    () => Array.from({ length: 11 }, (_, i) => ({
      x: -1.6 + (i % 4) * 1.0 + (i > 7 ? 0.5 : 0),
      z: -1.4 + Math.floor(i / 4) * 1.1,
      h: 0.5 + ((i * 53) % 10) / 7,
    })),
    [],
  );
  return (
    <group position={[GAP / 2 + 2.2, 0, 0]} onClick={(e) => { e.stopPropagation(); onTap(); }} {...pointerProps}>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.6, 3, 1.4, 9]} />
        <meshStandardMaterial color="#8a6b4a" roughness={1} flatShading />
      </mesh>
      {blocks.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2 + 0.1, b.z]}>
          <mesh>
            <boxGeometry args={[0.7, b.h, 0.7]} />
            <meshStandardMaterial color={i % 3 ? '#e8dccb' : '#d7b98f'} roughness={0.85} />
          </mesh>
          {Array.from({ length: Math.max(1, Math.floor(b.h / 0.4)) }, (_, k) => (
            <mesh key={k} position={[0, -b.h / 2 + 0.25 + k * 0.38, 0.352]}>
              <planeGeometry args={[0.42, 0.12]} />
              <meshBasicMaterial color={(i + k) % 3 ? '#ffd58a' : '#3b4566'} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <Palm position={[-2, 0.1, 1.5]} />
      <Palm position={[-1.2, 0.1, 2]} />
      <Palm position={[1.8, 0.1, 1.6]} />
      <Label text="Lomé" position={[0, 2.6, 0]} height={1.0} opts={{ font: "700 72px Georgia, serif", color: '#fff4e0' }} />
    </group>
  );
}

function Bridge({ lit, segments }: { lit: boolean; segments: number }) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const reduce = useSettings((s) => s.reduceMotion);
  const curve = useMemo(
    () => new THREE.QuadraticBezierCurve3(new THREE.Vector3(-GAP / 2 + 0.4, 0.1, 0), new THREE.Vector3(0, 1.6, 0), new THREE.Vector3(GAP / 2 - 0.4, 0.1, 0)),
    [],
  );
  const pts = useMemo(() => Array.from({ length: segments }, (_, i) => curve.getPoint((i + 0.5) / segments)), [curve, segments]);
  useFrame((_, dt) => {
    progress.current = reduce ? (lit ? 1 : 0) : damp(progress.current, lit ? 1 : 0, 1.6, dt);
    group.current?.children.forEach((c, i) => {
      // le pont se construit depuis les deux rives vers le centre
      const fromEdge = Math.min(i, segments - 1 - i) / (segments / 2);
      const k = THREE.MathUtils.clamp((progress.current - fromEdge * 0.85) * 5, 0, 1);
      c.scale.setScalar(Math.max(0.0001, k));
    });
  });
  return (
    <group ref={group}>
      {pts.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <boxGeometry args={[(GAP / segments) * 1.05, 0.08, 0.7]} />
            <meshStandardMaterial color="#d8b46a" emissive={COLORS.gold} emissiveIntensity={1.2} metalness={0.4} roughness={0.3} />
          </mesh>
          {i % 2 === 0 && <Glow position={[0, 0.25, 0.38]} size={0.7} opacity={0.9} color={COLORS.gold} />}
          {i % 2 === 0 && <Glow position={[0, 0.25, -0.38]} size={0.7} opacity={0.9} color={COLORS.gold} />}
        </group>
      ))}
    </group>
  );
}

function Water() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  useFrame((_, dt) => {
    if (mat.current && !reduce) mat.current.uniforms.t.value += dt;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
      <planeGeometry args={[40, 20, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={{ t: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
        fragmentShader={`uniform float t; varying vec2 vUv; void main(){
          float w = sin(vUv.x*120.0 + t*0.8)*sin(vUv.y*60.0 - t*0.6);
          vec3 deep = vec3(0.03,0.06,0.16); vec3 shine = vec3(0.95,0.72,0.42);
          float band = smoothstep(0.35,0.5,vUv.y)*smoothstep(0.65,0.5,vUv.y);
          vec3 c = deep + shine*band*0.12*(0.6+0.4*w) + vec3(0.02,0.03,0.06)*w;
          gl_FragColor = vec4(c,1.0);} `}
      />
    </mesh>
  );
}

export default function KaraLomeBridgeScene() {
  const lit = useJourney((s) => (s.revealed[4] ?? []).includes('bridge'));
  const reveal = useJourney((s) => s.reveal);
  const q = useSettings((s) => s.effective);
  const tap = () => reveal(4, 'bridge');
  return (
    <group>
      <Water />
      <Kara onTap={tap} />
      <Lome onTap={tap} />
      <Bridge lit={lit} segments={budget(q).segments} />
      {!lit && <Glow position={[0, 0.8, 0]} size={2.5} opacity={0.25} pulse={0.15} color={COLORS.gold} />}
      <Fireflies count={12} area={[16, 3, 6]} y={0.2} />
    </group>
  );
}
