import * as THREE from '../vendor/three.module.js';
import {loadCharacter} from './avatar-loader.js';

/**
 * Real, animated preview of the same avatar used in the world.
 * The caller owns the animation loop and must dispose this view after onboarding.
 */
export async function createAvatarPreview(canvas, appearance) {
  if (!canvas || typeof canvas.getContext !== 'function') {
    throw new TypeError('Avatar preview requires a canvas.');
  }

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#11252c');
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
  scene.add(new THREE.HemisphereLight('#f5ead7', '#253640', 1.75));

  const key = new THREE.DirectionalLight('#ffe6c5', 2.2);
  key.position.set(-2, 3.5, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight('#b3dce1', 1.25);
  fill.position.set(2, 2.5, -1.5);
  scene.add(fill);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.76, 0.06, 48),
    new THREE.MeshStandardMaterial({color: '#263f46', roughness: 0.8, metalness: 0.1}),
  );
  platform.position.y = 0.03;
  scene.add(platform);
  const edge = new THREE.Mesh(
    new THREE.RingGeometry(0.68, 0.70, 48),
    new THREE.MeshBasicMaterial({color: '#c7a969', side: THREE.DoubleSide}),
  );
  edge.rotation.x = -Math.PI / 2;
  edge.position.y = 0.061;
  scene.add(edge);

  let avatar = null;
  let generation = 0;
  let disposed = false;
  let width = 0;
  let height = 0;
  let pixelRatio = 0;
  let avatarHeight = 1.8;
  let avatarWidth = 0.55;
  const bounds = new THREE.Box3();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  function frameAvatar() {
    // Include the base as well as the body, including on narrow mobile screens.
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const framingHeight = avatarHeight + 0.28;
    const framingWidth = Math.max(1.6, avatarWidth + 0.25);
    const distance = Math.max(
      framingHeight / (2 * Math.tan(halfFov)),
      framingWidth / (2 * Math.tan(halfFov) * camera.aspect),
    );
    const targetY = avatarHeight / 2 + 0.06;
    camera.position.set(0, targetY + 0.07, distance);
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const nextWidth = Math.max(1, Math.round(canvas.clientWidth || 1));
    const nextHeight = Math.max(1, Math.round(canvas.clientHeight || 1));
    const nextPixelRatio = Math.min(1.5, Math.max(1, globalThis.devicePixelRatio || 1));
    if (width === nextWidth && height === nextHeight && pixelRatio === nextPixelRatio) return;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextPixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    frameAvatar();
  }

  async function updateAppearance(nextAppearance) {
    if (disposed) return false;
    const token = ++generation;
    // Snapshot the input: form values may change while the model is loading.
    const selection = {shirt: nextAppearance?.shirt, skin: nextAppearance?.skin};
    let nextAvatar;
    try {
      nextAvatar = await loadCharacter(selection);
      if (disposed || token !== generation) {
        nextAvatar.dispose();
        return false;
      }
      nextAvatar.update(0, 0);
      nextAvatar.group.updateMatrixWorld(true);
      bounds.setFromObject(nextAvatar.group);
      bounds.getSize(size);
      bounds.getCenter(center);
      nextAvatar.group.position.set(-center.x, 0.065 - bounds.min.y, -center.z);
      avatarHeight = Math.max(1, size.y);
      avatarWidth = Math.max(0.4, size.x);
      // The previous model stays visible until the replacement is completely ready.
      const previous = avatar;
      avatar = nextAvatar;
      scene.add(avatar.group);
      previous?.dispose();
      frameAvatar();
      return true;
    } catch (error) {
      if (nextAvatar && nextAvatar !== avatar) nextAvatar.dispose();
      if (disposed || token !== generation) return false;
      throw error;
    }
  }

  function render(dt = 0) {
    if (disposed) return;
    resize();
    avatar?.update(Number.isFinite(dt) ? Math.max(0, Math.min(dt, 0.1)) : 0, 0);
    renderer.render(scene, camera);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    ++generation; // Any pending loader result will dispose itself instead of mounting.
    avatar?.dispose();
    avatar = null;
    for (const mesh of [platform, edge]) {
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh.removeFromParent();
    }
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  try {
    resize();
    await updateAppearance(appearance);
    render(0);
    return {updateAppearance, render, dispose};
  } catch (error) {
    dispose();
    throw error;
  }
}
