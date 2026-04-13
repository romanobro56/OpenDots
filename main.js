import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';

// ── Constants ──────────────────────────────────────────────────────────────────

const SERVER      = 'http://localhost:5050';
const TRAVEL_MM   = 8.0;        // plunger lift in scene units — tune if over/undershooting
const LERP_SPEED  = 8.0;
const ROWS        = 8;
const COLS        = 12;
const TOTAL       = ROWS * COLS;
const MODEL_SCALE = 200;
const GLB_PATH    = 'assets/solenoid_grid.glb';

// ── TEST MODE ──────────────────────────────────────────────────────────────────
// Set TEST_MODE = true to drive the grid with hardcoded arrays instead of the
// Flask server. Edit TEST_FRAMES and TEST_DELAY_MS freely.
// You can also call setMatrix(myArray) from the browser console at any time.

const TEST_MODE     = true;
const TEST_DELAY_MS = 1000;   // ms between frames

const blank = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const allUp = Array.from({ length: ROWS }, () => Array(COLS).fill(1));

const letterA = [
  [0,0,0,1,1,1,1,0,0,0,0,0],
  [0,0,1,0,0,0,0,1,0,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,0,0],
];

// ← Add your own test frames here
const TEST_FRAMES = [blank, letterA, allUp, blank];

// ── Plunger name resolver ──────────────────────────────────────────────────────
// index 0  → "plunger"
// index 1  → "plunger.001"
// index 13 → "plunger.013"
// Row-major: index = row * COLS + col

function plungerName(index) {
  // Blender names: plunger.001 (index 0) through plunger.096 (index 95)
  // Solenoid v8:N wrapper contains plunger.00N where N = index+1
  return `plunger.${String(index + 1).padStart(3, '0')}`;
}

// ── Visual profiles ────────────────────────────────────────────────────────────

const PROFILES = {
  default: {
    label:    'Default',
    bg:       0x0e0e0c,
    fog:      [0x0e0e0c, 1200, 2700],
    board:    { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body:     { color: 0x4a4845, roughness: 0.50, metalness: 0.7 },
    plunger:  { color: 0x6aaa3a, roughness: 0.30, metalness: 0.5 },
    emissive: { color: 0xa0e060, intensity: 1.8 },
  },
  cortical: {
    label:    'Cortical Visual Impairment',
    bg:       0x000000,
    fog:      [0x000000, 1200, 2700],
    board:    { color: 0x000000, roughness: 1.0,  metalness: 0.0 },
    body:     { color: 0x111111, roughness: 1.0,  metalness: 0.0 },
    plunger:  { color: 0xffffff, roughness: 0.8,  metalness: 0.0 },
    emissive: { color: 0xffffff, intensity: 3.5 },
  },
  snow: {
    label:    'Visual Snow Syndrome',
    bg:       0x111111,
    fog:      [0x111111, 1200, 2700],
    board:    { color: 0x1a1a1a, roughness: 1.0,  metalness: 0.0 },
    body:     { color: 0x222222, roughness: 1.0,  metalness: 0.0 },
    plunger:  { color: 0xdddddd, roughness: 0.95, metalness: 0.0 },
    emissive: { color: 0xffff00, intensity: 3.0 },
  },
  deutan: {
    label:    'Deuteranopia',
    bg:       0x0e0e0c,
    fog:      [0x0e0e0c, 1200, 2700],
    board:    { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body:     { color: 0x4a4845, roughness: 0.50, metalness: 0.7 },
    plunger:  { color: 0x4499ff, roughness: 0.30, metalness: 0.4 },
    emissive: { color: 0x0088ff, intensity: 2.2 },
  },
  protan: {
    label:    'Protanopia',
    bg:       0x0e0e0c,
    fog:      [0x0e0e0c, 1200, 2700],
    board:    { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body:     { color: 0x4a4845, roughness: 0.50, metalness: 0.7 },
    plunger:  { color: 0x44ccff, roughness: 0.30, metalness: 0.4 },
    emissive: { color: 0x00ccff, intensity: 2.2 },
  },
  tritan: {
    label:    'Tritanopia',
    bg:       0x0e0e0c,
    fog:      [0x0e0e0c, 1200, 2700],
    board:    { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body:     { color: 0x4a4845, roughness: 0.50, metalness: 0.7 },
    plunger:  { color: 0xff6622, roughness: 0.30, metalness: 0.4 },
    emissive: { color: 0xff4400, intensity: 2.2 },
  },
  nearfar: {
    label:    'Near / Far Sightedness',
    bg:       0x0a0a08,
    fog:      [0x0a0a08, 1200, 2700],
    board:    { color: 0x222220, roughness: 1.0,  metalness: 0.0 },
    body:     { color: 0x333330, roughness: 1.0,  metalness: 0.0 },
    plunger:  { color: 0xffffff, roughness: 0.9,  metalness: 0.0 },
    emissive: { color: 0xffee00, intensity: 3.2 },
  },
  grayscale: {
    label:    'Full Grayscale',
    bg:       0x181818,
    fog:      [0x181818, 1200, 2700],
    board:    { color: 0x303030, roughness: 0.9,  metalness: 0.0 },
    body:     { color: 0x505050, roughness: 0.7,  metalness: 0.0 },
    plunger:  { color: 0xcccccc, roughness: 0.5,  metalness: 0.0 },
    emissive: { color: 0xffffff, intensity: 2.5 },
  },
};

// ── Shared material references ─────────────────────────────────────────────────

const mats = {
  board:              null,
  body:               null,
  plunger:            null,
  _emissiveColor:     new THREE.Color(0xa0e060),
  _emissiveIntensity: 1.8,
};

function applyProfile(key) {
  const p = PROFILES[key];
  if (!p) return;

  scene.background.setHex(p.bg);
  scene.fog.color.setHex(p.fog[0]);
  scene.fog.near = p.fog[1];
  scene.fog.far  = p.fog[2];

  if (mats.board) {
    mats.board.color.setHex(p.board.color);
    mats.board.roughness = p.board.roughness;
    mats.board.metalness = p.board.metalness;
    mats.board.needsUpdate = true;
  }
  if (mats.body) {
    mats.body.color.setHex(p.body.color);
    mats.body.roughness = p.body.roughness;
    mats.body.metalness = p.body.metalness;
    mats.body.needsUpdate = true;
  }
  if (mats.plunger) {
    mats.plunger.color.setHex(p.plunger.color);
    mats.plunger.roughness = p.plunger.roughness;
    mats.plunger.metalness = p.plunger.metalness;
    mats.plunger.needsUpdate = true;
  }

  mats._emissiveColor.setHex(p.emissive.color);
  mats._emissiveIntensity = p.emissive.intensity;

  document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.profile === key);
  });

  setStatus(`profile: ${p.label}`);
}

// ── Scene ──────────────────────────────────────────────────────────────────────

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0c);
scene.fog = new THREE.Fog(0x0e0e0c, 1200, 2700);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(-300, 360, 500);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor  = 0.08;
controls.minDistance    = 150;
controls.maxDistance    = 1500;
controls.maxPolarAngle  = Math.PI / 2;

// ── Lighting ───────────────────────────────────────────────────────────────────

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(80, 200, 100);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left   = -600;
keyLight.shadow.camera.right  =  600;
keyLight.shadow.camera.top    =  600;
keyLight.shadow.camera.bottom = -600;
scene.add(keyLight);

scene.add(Object.assign(new THREE.DirectionalLight(0x88ccff, 0.5), {
  position: new THREE.Vector3(-100, 80, -60)
}));
scene.add(Object.assign(new THREE.DirectionalLight(0xa0e060, 0.3), {
  position: new THREE.Vector3(0, -50, -150)
}));

// ── Numpad 1 camera preset ─────────────────────────────────────────────────────

function setCameraNumpad1() {
  camera.position.set(-260, 280, -480);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);
  controls.update();
}

// ── Solenoid registry ──────────────────────────────────────────────────────────

const plungers    = new Array(TOTAL).fill(null);
let targetMatrix  = new Float32Array(TOTAL);
let currentMatrix = new Float32Array(TOTAL);
let modelLoaded   = false;

// ── GLB loader ─────────────────────────────────────────────────────────────────

const loader = new GLTFLoader();
loader.load(
  GLB_PATH,
  (gltf) => {
    gltf.scene.scale.setScalar(MODEL_SCALE);
    scene.add(gltf.scene);

    const nameMap = {};
    gltf.scene.traverse(obj => { nameMap[obj.name] = obj; });

    let found = 0;
    for (let i = 0; i < TOTAL; i++) {
      const name = plungerName(i);
      const mesh = nameMap[name];
      if (!mesh) {
        console.warn(`Plunger not found in GLB: "${name}"`);
        continue;
      }

      if (mesh.isMesh) {
        if (!mats.plunger) {
          mats.plunger = mesh.material.clone();
          mats.plunger.color.setHex(0x6aaa3a);
          mats.plunger.roughness = 0.30;
          mats.plunger.metalness = 0.50;
          mats.plunger.emissive  = new THREE.Color(0xa0e060);
          mats.plunger.emissiveIntensity = 0;
        }
        mesh.material = mats.plunger;
        mesh.castShadow = true;
      }

      plungers[i] = { mesh, baseY: mesh.position.y };
      found++;
    }
    console.log(`Wired ${found}/${TOTAL} plungers`);

    // Box — semi-transparent shell
    const box = nameMap['Box'];
    if (box) {
      box.traverse(obj => {
        if (!obj.isMesh) return;
        obj.material             = obj.material.clone();
        obj.material.transparent = true;
        obj.material.opacity     = 0.18;
        obj.material.depthWrite  = false;
        obj.material.side        = THREE.DoubleSide;
        obj.material.needsUpdate = true;
        mats.board               = obj.material;
      });
    }

    // Cylinder — keep transparent
    const cyl = nameMap['cylinder'];
    if (cyl) {
      cyl.traverse(obj => {
        if (!obj.isMesh) return;
        obj.material             = obj.material.clone();
        obj.material.transparent = true;
        obj.material.opacity     = 0.12;
        obj.material.depthWrite  = false;
        obj.material.needsUpdate = true;
      });
    }

    // Capture body material for profile swaps
    ['Corps-Principal:1', 'Noyau:1', 'Divers:1'].forEach(n => {
      const obj = nameMap[n];
      if (obj && !mats.body) {
        obj.traverse(child => {
          if (child.isMesh && !mats.body) {
            mats.body = child.material.clone();
            child.material = mats.body;
          }
        });
      }
    });

    modelLoaded = true;
    applyProfile('default');

    if (TEST_MODE) {
      setStatus('test mode — cycling frames');
      runTestLoop();
    } else {
      setStatus('ready — press a key');
    }
  },
  (p) => {
    if (p.total > 0) setStatus(`loading… ${Math.round((p.loaded / p.total) * 100)}%`);
  },
  (e) => {
    console.error(e);
    setStatus('error loading GLB', true);
  }
);

// ── Test loop ──────────────────────────────────────────────────────────────────

function setMatrix(matrix2d) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      targetMatrix[row * COLS + col] = matrix2d[row]?.[col] ?? 0;
    }
  }
}

async function runTestLoop() {
  while (true) {
    for (const frame of TEST_FRAMES) {
      setMatrix(frame);
      await new Promise(r => setTimeout(r, TEST_DELAY_MS));
    }
  }
}

// ── Key input (only active when TEST_MODE = false) ─────────────────────────────

const VALID_KEYS = new Set(
  'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[]{}\\|;\':",.<>/?  '.split('')
);

let lastKey       = null;
let debounceTimer = null;

window.addEventListener('keydown', (e) => {
  if (e.code === 'Numpad1') { setCameraNumpad1(); return; }
  if (TEST_MODE) return;
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  const key = e.key.length === 1 ? e.key : null;
  if (!key || !VALID_KEYS.has(key.toLowerCase())) return;
  e.preventDefault();
  if (key === lastKey) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => sendKey(key), 30);
});

async function sendKey(key) {
  lastKey = key;
  updateKeyDisplay(key);
  setStatus(`key: ${key === ' ' ? 'space' : key}`);

  try {
    const res = await fetch(`${SERVER}/key`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ key: key === ' ' ? 'space' : key.toLowerCase() }),
    });

    if (!res.ok) { setStatus(`no image for "${key}"`, true); return; }

    const data = await res.json();
    if (data.matrix?.length === TOTAL) {
      for (let i = 0; i < TOTAL; i++) targetMatrix[i] = Number(data.matrix[i]);
      if (window.updateMatrixReadout) window.updateMatrixReadout(targetMatrix);
      setStatus(`displaying: ${key === ' ' ? 'space' : key}`);
    } else {
      setStatus('bad matrix from server', true);
    }
  } catch {
    setStatus('server offline — run: python server.py', true);
  }
}

// ── Render loop ────────────────────────────────────────────────────────────────

const clock = new THREE.Clock();

(function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  if (modelLoaded) {
    for (let i = 0; i < TOTAL; i++) {
      const p = plungers[i];
      if (!p) continue;
      currentMatrix[i] += (targetMatrix[i] - currentMatrix[i]) * Math.min(dt * LERP_SPEED, 1);
      p.mesh.position.y = p.baseY + currentMatrix[i] * TRAVEL_MM;
    }

    if (mats.plunger) {
      const avg = currentMatrix.reduce((s, v) => s + v, 0) / TOTAL;
      mats.plunger.emissive.copy(mats._emissiveColor);
      mats.plunger.emissiveIntensity = avg * mats._emissiveIntensity;
    }
  }

  controls.update();
  renderer.render(scene, camera);
})();

// ── Resize ─────────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── UI helpers ─────────────────────────────────────────────────────────────────

function setStatus(msg, isError = false) {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#e24b4a' : '#6aaa3a';
}

function updateKeyDisplay(key) {
  const el = document.getElementById('key-display');
  if (!el) return;
  el.textContent = key === ' ' ? '␣' : key.toUpperCase();
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'keypop 0.2s ease-out';
}

// Expose globally
window.applyProfile = applyProfile;
window.setMatrix    = setMatrix;   // call from console: setMatrix(myArray)
