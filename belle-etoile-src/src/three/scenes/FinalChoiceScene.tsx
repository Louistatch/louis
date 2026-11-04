import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useJourney } from '../../state/journeyStore';
import { useSettings } from '../../state/settings';
import { COLORS, damp, Glow, StarPoint } from '../common';
import { NODE_POSITIONS } from '../StarMap3D';

/** Particules dorées montantes, douces (seulement pour « oui »). */
function GoldenRise({ count = 60 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p.set([(Math.random() - 0.5) * 8, Math.random() * 6 - 1, (Math.random() - 0.5) * 4 - 2], i * 3);
      s[i] = Math.random() * 10;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('seed', new THREE.BufferAttribute(s, 1));
    return g;
  }, [count]);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  useFrame((_, dt) => {
    if (mat.current && !reduce) mat.current.uniforms.t.value += dt;
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ t: { value: 0 } }}
        vertexShader={`attribute float seed; uniform float t; varying float vA;
          void main(){ vec3 p = position; p.y = mod(p.y + t*0.25 + seed, 7.0) - 1.0; vA = 0.6*sin(3.14*(p.y+1.0)/7.0);
            vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = 60.0/(-mv.z); gl_Position = projectionMatrix*mv; }`}
        fragmentShader={`varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard;
          gl_FragColor = vec4(1.0,0.82,0.5, vA*pow(1.0-d*2.0,2.0)); }`}
      />
    </points>
  );
}

export default function FinalChoiceScene() {
  const answer = useJourney((s) => s.answer);
  const nearYes = useSettings((s) => s.nearYes);
  const star = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!star.current) return;
    const target = answer === 'no' ? 0.7 : answer === 'yes' ? 1.25 : nearYes ? 1.35 : 1;
    star.current.scale.setScalar(damp(star.current.scale.x, target, 2, dt));
  });
  const constellation = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < NODE_POSITIONS.length - 1; i++) pts.push(...NODE_POSITIONS[i], ...NODE_POSITIONS[i + 1]);
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <group>
      <group ref={star} position={[0, 2.2, -2]}>
        <StarPoint size={3} color={answer === 'talk' ? '#bcd0ff' : COLORS.gold} pulse={answer === 'no' ? 0.02 : 0.06} lit />
        <Glow size={nearYes && !answer ? 12 : 9} opacity={answer === 'no' ? 0.1 : nearYes ? 0.4 : 0.22} color={answer === 'yes' || nearYes ? COLORS.gold : '#9fb0ff'} />
        {nearYes && !answer && <Glow size={4} opacity={0.6} color={COLORS.rose} pulse={0.12} />}
      </group>
      {answer === 'yes' && (
        <group position={[0, 1.8, -7]} scale={0.8}>
          <lineSegments geometry={constellation}>
            <lineBasicMaterial color={COLORS.gold} transparent opacity={0.9} />
          </lineSegments>
          {NODE_POSITIONS.map((p, i) => (
            <StarPoint key={i} position={p} size={0.9} />
          ))}
          <GoldenRise />
        </group>
      )}
    </group>
  );
}
