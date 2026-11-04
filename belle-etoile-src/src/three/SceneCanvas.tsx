import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useJourney } from '../state/journeyStore';
import { budget, useSettings } from '../state/settings';
import { SkyDome, Stars } from './common';
import DreamHorizonScene from './scenes/DreamHorizonScene';
import FinalChoiceScene from './scenes/FinalChoiceScene';
import FirstMessageScene from './scenes/FirstMessageScene';
import Future2027Scene from './scenes/Future2027Scene';
import GestureGardenScene from './scenes/GestureGardenScene';
import IntroScene from './scenes/IntroScene';
import KaraLomeBridgeScene from './scenes/KaraLomeBridgeScene';
import RomanceBookScene from './scenes/RomanceBookScene';
import TrustCompassScene from './scenes/TrustCompassScene';
import StarMap3D from './StarMap3D';

type V3 = [number, number, number];
interface Shot {
  pos: V3;
  target: V3;
  sky: [string, string, string];
  /** Recul supplémentaire en portrait pour les scènes larges. */
  portrait?: number;
}

export const SHOTS: Record<string, Shot> = {
  intro: { pos: [0, 1.2, 8], target: [0, 2.4, -6], sky: ['#050817', '#1d2152', '#f08a5d'] },
  '1': { pos: [0, 1.7, 5.4], target: [0, 1.5, 0], sky: ['#060a1f', '#1a2350', '#b06a7a'] },
  '2': { portrait: 1.3, pos: [0, 2.9, 3.4], target: [0, 0.9, 0], sky: ['#0a0a1a', '#241a33', '#7a4a3a'] },
  '3': { portrait: 0.9, pos: [0, 3.0, 7.2], target: [0, 1.3, 0], sky: ['#050b18', '#13284a', '#3e6a6a'] },
  '4': { portrait: 1.85, pos: [0, 3.8, 11.5], target: [0, 0.4, 0], sky: ['#060a1d', '#1b2456', '#e08a5a'] },
  '5': { pos: [0, 1.7, 6.8], target: [0, 1.4, -1.5], sky: ['#0b0a22', '#2b2560', '#ff9a62'] },
  '6': { portrait: 1.35, pos: [0, 1.8, 6.4], target: [0, 1.5, 0], sky: ['#04071a', '#0f1640', '#3a4a8a'] },
  '7': { pos: [0, 2.3, 7.4], target: [0, 1.8, -3], sky: ['#060818', '#1a1d48', '#d98a8a'] },
  '8': { pos: [0, 2.1, 4.2], target: [0, 2.2, -2], sky: ['#03050f', '#0b1030', '#2a2f6a'] },
  map: { pos: [0, 1.6, 6.8], target: [0, 1.6, -3], sky: ['#03050f', '#0d1236', '#3a2f6a'] },
};

export function useShotKey() {
  const mode = useJourney((s) => s.mode);
  const current = useJourney((s) => s.current);
  if (mode === 'intro') return 'intro';
  if (mode === 'map') return 'map';
  if (mode === 'choice' || mode === 'outcome') return '8';
  return String(current);
}

/** Caméra à trajectoire douce ; recule en portrait pour garder la scène lisible au-dessus du texte. */
function CameraRig({ shotKey }: { shotKey: string }) {
  const { camera, size, gl } = useThree();
  const reduce = useSettings((s) => s.reduceMotion);
  const explore = useSettings((s) => s.explore);
  const target = useRef(new THREE.Vector3(...SHOTS.intro.target));
  const controls = useRef<OrbitControls | null>(null);
  const goal = useMemo(() => {
    const shot = SHOTS[shotKey] ?? SHOTS.intro;
    const t = new THREE.Vector3(...shot.target);
    const p = new THREE.Vector3(...shot.pos);
    const aspect = size.width / size.height;
    if (aspect < 1) {
      // portrait : recul + regard plus bas pour placer la scène dans la moitié haute
      const k = Math.min(1.75, Math.pow(1 / aspect, 0.62)) * (shot.portrait ?? 1);
      p.sub(t).multiplyScalar(k).add(t);
      t.y -= 0.9 * (k - 1) + 0.35;
    } else if (aspect > 1.3 && size.height < 500) {
      // paysage sur téléphone : le texte est à droite, on décale la scène vers la gauche
      const dx = p.distanceTo(t) * 0.28;
      p.x += dx;
      t.x += dx;
    }
    return { p, t };
  }, [shotKey, size.width, size.height]);

  useEffect(() => {
    if (!explore) return;
    const c = new OrbitControls(camera, gl.domElement);
    c.target.copy(goal.t);
    c.enablePan = false;
    c.enableDamping = true;
    c.minDistance = 2;
    c.maxDistance = 16;
    c.maxPolarAngle = Math.PI * 0.55;
    controls.current = c;
    return () => {
      c.dispose();
      controls.current = null;
    };
  }, [explore, camera, gl, goal]);

  useFrame(({ clock }, dt) => {
    if (controls.current) {
      controls.current.update();
      return;
    }
    const sway = reduce ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.25;
    const lambda = reduce ? 8 : 2.2;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.p.x + sway, lambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.p.y, lambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.p.z, lambda, dt);
    target.current.x = THREE.MathUtils.damp(target.current.x, goal.t.x, lambda, dt);
    target.current.y = THREE.MathUtils.damp(target.current.y, goal.t.y, lambda, dt);
    target.current.z = THREE.MathUtils.damp(target.current.z, goal.t.z, lambda, dt);
    camera.lookAt(target.current);
  });
  return null;
}

/** Mode auto : si le téléphone peine (< 28 i/s en moyenne), on baisse la qualité. */
function QualityManager() {
  const quality = useSettings((s) => s.quality);
  const effective = useSettings((s) => s.effective);
  const setEffective = useSettings((s) => s.setEffective);
  const acc = useRef({ t: 0, f: 0, skip: 2 });
  useFrame((_, dt) => {
    if (quality !== 'auto') return;
    const a = acc.current;
    a.t += dt;
    a.f++;
    if (a.t >= 3) {
      const fps = a.f / a.t;
      if (a.skip > 0) a.skip--; // ignore le démarrage (compilation des shaders)
      else if (fps < 28 && effective !== 'low') {
        setEffective(effective === 'high' ? 'medium' : 'low');
        a.skip = 2;
      }
      (window as unknown as { __fps?: number }).__fps = Math.round(fps);
      a.t = 0;
      a.f = 0;
    }
  });
  return null;
}

function ActiveScene({ shotKey }: { shotKey: string }) {
  switch (shotKey) {
    case 'intro':
      return <IntroScene />;
    case 'map':
      return <StarMap3D />;
    case '1':
      return <FirstMessageScene />;
    case '2':
      return <RomanceBookScene />;
    case '3':
      return <GestureGardenScene />;
    case '4':
      return <KaraLomeBridgeScene />;
    case '5':
      return <DreamHorizonScene />;
    case '6':
      return <TrustCompassScene />;
    case '7':
      return <Future2027Scene />;
    default:
      return <FinalChoiceScene />;
  }
}

export default function SceneCanvas() {
  const shotKey = useShotKey();
  const effective = useSettings((s) => s.effective);
  const b = budget(effective);
  const dpr = Math.min(b.dpr, typeof window !== 'undefined' ? window.devicePixelRatio : 1);
  const shot = SHOTS[shotKey] ?? SHOTS.intro;
  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      gl={{ antialias: effective !== 'low', powerPreference: 'high-performance', alpha: false }}
      camera={{ position: SHOTS.intro.pos, fov: 50, near: 0.1, far: 200 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        (window as unknown as { __webglReady?: boolean }).__webglReady = true;
      }}
    >
      <color attach="background" args={[shot.sky[0]]} />
      <fog attach="fog" args={[shot.sky[1], 14, 70]} />
      <hemisphereLight args={['#c9d4ff', '#2a1c24', 0.9]} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#ffe2bd" />
      <directionalLight position={[-5, 3, -4]} intensity={0.35} color="#8fa2ff" />
      <SkyDome top={shot.sky[0]} mid={shot.sky[1]} bottom={shot.sky[2]} />
      <Stars count={b.stars} />
      <Suspense fallback={null}>
        <ActiveScene shotKey={shotKey} />
      </Suspense>
      <CameraRig shotKey={shotKey} />
      <QualityManager />
    </Canvas>
  );
}
