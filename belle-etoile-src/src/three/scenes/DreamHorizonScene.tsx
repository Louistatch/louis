import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useJourney } from '../../state/journeyStore';
import { useSettings } from '../../state/settings';
import { COLORS, damp, Fireflies, Float, Glow, pointerProps } from '../common';

function Portal({ open }: { open: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  useFrame((_, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    if (!reduce) u.t.value += dt;
    u.open.value = damp(u.open.value, open ? 1 : 0.12, 1.5, dt);
  });
  return (
    <group position={[0, 1.6, -2.5]}>
      <mesh>
        <torusGeometry args={[1.6, 0.09, 12, 64, Math.PI]} />
        <meshStandardMaterial color={COLORS.gold} emissive={COLORS.goldDeep} emissiveIntensity={0.8} metalness={0.8} roughness={0.25} />
      </mesh>
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, -0.9, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 1.8, 12]} />
          <meshStandardMaterial color={COLORS.gold} emissive={COLORS.goldDeep} emissiveIntensity={0.6} metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      {/* horizon lumineux à l'intérieur de l'arche */}
      <mesh position={[0, -0.25, -0.02]}>
        <planeGeometry args={[3.1, 3.3]} />
        <shaderMaterial
          ref={mat}
          transparent
          depthWrite={false}
          uniforms={{ t: { value: 0 }, open: { value: 0.12 } }}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
          fragmentShader={`uniform float t; uniform float open; varying vec2 vUv;
            void main(){ vec2 p = vUv - vec2(0.5,0.27);
              float arch = step(length(vec2(p.x, max(p.y,0.0))*vec2(1.0,0.94)), 0.5) * step(-0.27, p.y);
              vec3 sky = mix(vec3(1.0,0.62,0.38), vec3(0.98,0.86,0.62), smoothstep(0.0,0.6,vUv.y));
              sky = mix(sky, vec3(0.55,0.62,0.95), smoothstep(0.55,1.0,vUv.y));
              float sun = exp(-length((vUv-vec2(0.5,0.32))*vec2(1.0,1.3))*9.0);
              float rays = 0.5+0.5*sin(atan(p.y,p.x)*14.0 + t*0.4);
              vec3 c = sky + vec3(1.0,0.9,0.7)*sun*1.2 + rays*0.05;
              gl_FragColor = vec4(c, arch*open*0.95); }`}
        />
      </mesh>
      <Glow position={[0, -0.3, 0.1]} size={open ? 7 : 2} opacity={open ? 0.5 : 0.2} color={COLORS.warm} />
    </group>
  );
}

function Suitcase({ onTap, open }: { onTap: () => void; open: boolean }) {
  return (
    <Float amp={open ? 0.04 : 0.1} speed={1.2}>
      <group position={[1.6, 0.42, 0.6]} rotation={[0, -0.5, 0]} onClick={(e) => { e.stopPropagation(); onTap(); }} {...pointerProps}>
        <mesh visible={false}>
          <boxGeometry args={[1.4, 1.4, 1.0]} />
          <meshBasicMaterial />
        </mesh>
        <mesh>
          <boxGeometry args={[0.8, 0.6, 0.3]} />
          <meshStandardMaterial color="#8b3a4a" roughness={0.5} />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0, 0.151]}>
            <planeGeometry args={[0.04, 0.6]} />
            <meshStandardMaterial color="#c99b5a" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.36, 0]}>
          <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#2a1d18" />
        </mesh>
        {!open && <Glow size={1.4} opacity={0.35} pulse={0.15} color={COLORS.rose} />}
      </group>
    </Float>
  );
}

export default function DreamHorizonScene() {
  const open = useJourney((s) => (s.revealed[5] ?? []).includes('portal'));
  const reveal = useJourney((s) => s.reveal);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 48]} />
        <meshStandardMaterial color="#1a1733" roughness={1} />
      </mesh>
      {/* chemin vers l'horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
        <planeGeometry args={[1.2, 7]} />
        <meshStandardMaterial color="#3a3357" emissive={open ? '#6b4a3a' : '#000000'} emissiveIntensity={0.6} roughness={0.9} />
      </mesh>
      <Portal open={open} />
      <Suitcase open={open} onTap={() => reveal(5, 'portal')} />
      <Fireflies count={open ? 40 : 14} area={[4, 3, 4]} y={0.4} color={open ? '#ffe0a8' : '#c9b8ff'} />
    </group>
  );
}
