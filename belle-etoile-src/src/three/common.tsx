import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSettings } from '../state/settings';
import { glowTexture, textTexture, type LabelOpts } from './textures';

export const COLORS = {
  night: '#070b1f',
  navy: '#101a44',
  gold: '#f2c97d',
  goldDeep: '#d9a441',
  cream: '#fff4e0',
  rose: '#e8a5b4',
  warm: '#ff9a62',
};

/** Ciel en dégradé (dôme) — une seule draw call. */
export function SkyDome({ top = '#060a1c', mid = '#1b2456', bottom = '#e88a5a', offset = 0.08 }) {
  const uniforms = useMemo(
    () => ({
      top: { value: new THREE.Color(top) },
      mid: { value: new THREE.Color(mid) },
      bottom: { value: new THREE.Color(bottom) },
      offset: { value: offset },
    }),
    [top, mid, bottom, offset],
  );
  return (
    <mesh scale={80} renderOrder={-10}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
        fragmentShader={`uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; uniform float offset; varying vec3 vP;
          void main(){ float h = vP.y + offset;
            vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.55, h)) : mix(mid, top*0.7, smoothstep(0.0, -0.35, h));
            float glow = exp(-abs(h)*7.0); c = mix(c, bottom, glow*0.75);
            gl_FragColor = vec4(c,1.0);} `}
      />
    </mesh>
  );
}

/** Champ d'étoiles scintillantes (shader, nombre selon la qualité). */
export function Stars({ count = 1000, radius = 60, minY = -0.05 }) {
  const reduce = useSettings((s) => s.reduceMotion);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      let y = Math.abs(u);
      if (y < minY) y = minY + Math.random() * 0.2;
      const r = Math.sqrt(1 - y * y);
      p.set([Math.cos(th) * r * radius, y * radius, Math.sin(th) * r * radius], i * 3);
      s[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('seed', new THREE.BufferAttribute(s, 1));
    return g;
  }, [count, radius, minY]);
  const mat = useRef<THREE.ShaderMaterial>(null);
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
          void main(){ vA = 0.45 + 0.55*sin(t*(0.6+seed*1.6) + seed*40.0)*0.5 + 0.25;
            gl_PointSize = 1.2 + seed*2.6; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
        fragmentShader={`varying float vA; void main(){ float d = length(gl_PointCoord-0.5); if(d>0.5) discard;
          gl_FragColor = vec4(1.0,0.96,0.88, vA*(1.0-d*2.0)); }`}
      />
    </points>
  );
}

/** Halo additif (étoile, lanterne). */
export function Glow({
  color = COLORS.gold,
  size = 1,
  opacity = 1,
  position,
  pulse = 0,
}: {
  color?: string;
  size?: number;
  opacity?: number;
  position?: [number, number, number];
  pulse?: number;
}) {
  const ref = useRef<THREE.Sprite>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  const tex = useMemo(() => glowTexture(), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const k = pulse && !reduce ? 1 + Math.sin(clock.elapsedTime * 2.2) * pulse : 1;
    ref.current.scale.setScalar(size * k);
  });
  return (
    <sprite ref={ref} position={position} scale={size}>
      <spriteMaterial
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

/** Étoile : noyau + halo. */
export function StarPoint({
  position,
  size = 1,
  lit = true,
  color = COLORS.gold,
  pulse = 0.08,
}: {
  position?: [number, number, number];
  size?: number;
  lit?: boolean;
  color?: string;
  pulse?: number;
}) {
  return (
    <group position={position}>
      <mesh>
        <icosahedronGeometry args={[0.12 * size, 1]} />
        <meshBasicMaterial color={lit ? '#fffaf0' : '#55607e'} toneMapped={false} />
      </mesh>
      <Glow color={lit ? color : '#3a4466'} size={lit ? 1.6 * size : 0.7 * size} opacity={lit ? 1 : 0.5} pulse={lit ? pulse : 0} />
    </group>
  );
}

/** Étiquette texte toujours face caméra. */
export function Label({
  text,
  position,
  height = 0.45,
  opts,
}: {
  text: string;
  position?: [number, number, number];
  height?: number;
  opts?: LabelOpts;
}) {
  const { tex, aspect } = useMemo(() => textTexture(text, { width: 640, ...opts }), [text, opts]);
  return (
    <sprite position={position} scale={[height * aspect, height, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

/** Lucioles : points dérivant lentement (shader). */
export function Fireflies({
  count = 30,
  area = [8, 2.5, 6] as [number, number, number],
  y = 0.6,
  color = '#ffd27a',
}) {
  const reduce = useSettings((s) => s.reduceMotion);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p.set([(Math.random() - 0.5) * area[0], y + Math.random() * area[1], (Math.random() - 0.5) * area[2]], i * 3);
      s[i] = Math.random() * 100;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('seed', new THREE.BufferAttribute(s, 1));
    return g;
  }, [count, area, y]);
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, dt) => {
    if (mat.current && !reduce) mat.current.uniforms.t.value += dt;
  });
  const uniforms = useMemo(() => ({ t: { value: 0 }, c: { value: new THREE.Color(color) } }), [color]);
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`attribute float seed; uniform float t; varying float vA;
          void main(){ vec3 p = position; p.x += sin(t*0.4+seed)*0.35; p.y += sin(t*0.7+seed*2.0)*0.25; p.z += cos(t*0.3+seed)*0.35;
            vA = 0.4 + 0.6*abs(sin(t*1.3+seed*3.0));
            vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = 70.0/(-mv.z); gl_Position = projectionMatrix*mv; }`}
        fragmentShader={`uniform vec3 c; varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard;
          gl_FragColor = vec4(c, vA*pow(1.0-d*2.0,2.0)); }`}
      />
    </points>
  );
}

/** Flottement doux (désactivé si « réduire les animations »). */
export function Float({ children, amp = 0.08, speed = 1, rot = 0 }: { children: React.ReactNode; amp?: number; speed?: number; rot?: number }) {
  const ref = useRef<THREE.Group>(null);
  const reduce = useSettings((s) => s.reduceMotion);
  useFrame(({ clock }) => {
    if (!ref.current || reduce) return;
    const t = clock.elapsedTime * speed;
    ref.current.position.y = Math.sin(t) * amp;
    ref.current.rotation.y = Math.sin(t * 0.5) * rot;
  });
  return <group ref={ref}>{children}</group>;
}

/** Interpolation amortie indépendante du framerate. */
export const damp = (a: number, b: number, lambda: number, dt: number) => THREE.MathUtils.damp(a, b, lambda, dt);

/** Curseur « main » sur ordinateur pour les objets cliquables. */
export const pointerProps = {
  onPointerOver: () => (document.body.style.cursor = 'pointer'),
  onPointerOut: () => (document.body.style.cursor = ''),
};
