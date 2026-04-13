"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ── Constants ────────────────────────────────────────────────────────────────

const TRAVEL_MM = 8.0;
const LERP_SPEED = 8.0;
const ROWS = 8;
const COLS = 12;
const TOTAL = ROWS * COLS;
const MODEL_SCALE = 2000;
const GLB_PATH = "/solenoid_grid.glb";

// ── Visual profiles ──────────────────────────────────────────────────────────

export interface ProfileDef {
  label: string;
  bg: number;
  fog: [number, number, number];
  board: { color: number; roughness: number; metalness: number };
  body: { color: number; roughness: number; metalness: number };
  plunger: { color: number; roughness: number; metalness: number };
  emissive: { color: number; intensity: number };
}

export const PROFILES: Record<string, ProfileDef> = {
  default: {
    label: "Default",
    bg: 0x0e0e0c,
    fog: [0x0e0e0c, 1200, 2700],
    board: { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body: { color: 0x4a4845, roughness: 0.5, metalness: 0.7 },
    plunger: { color: 0x6aaa3a, roughness: 0.3, metalness: 0.5 },
    emissive: { color: 0xa0e060, intensity: 1.8 },
  },
  cortical: {
    label: "Cortical Visual Impairment",
    bg: 0x000000,
    fog: [0x000000, 1200, 2700],
    board: { color: 0x000000, roughness: 1.0, metalness: 0.0 },
    body: { color: 0x111111, roughness: 1.0, metalness: 0.0 },
    plunger: { color: 0xffffff, roughness: 0.8, metalness: 0.0 },
    emissive: { color: 0xffffff, intensity: 3.5 },
  },
  snow: {
    label: "Visual Snow Syndrome",
    bg: 0x111111,
    fog: [0x111111, 1200, 2700],
    board: { color: 0x1a1a1a, roughness: 1.0, metalness: 0.0 },
    body: { color: 0x222222, roughness: 1.0, metalness: 0.0 },
    plunger: { color: 0xdddddd, roughness: 0.95, metalness: 0.0 },
    emissive: { color: 0xffff00, intensity: 3.0 },
  },
  deutan: {
    label: "Deuteranopia",
    bg: 0x0e0e0c,
    fog: [0x0e0e0c, 1200, 2700],
    board: { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body: { color: 0x4a4845, roughness: 0.5, metalness: 0.7 },
    plunger: { color: 0x4499ff, roughness: 0.3, metalness: 0.4 },
    emissive: { color: 0x0088ff, intensity: 2.2 },
  },
  protan: {
    label: "Protanopia",
    bg: 0x0e0e0c,
    fog: [0x0e0e0c, 1200, 2700],
    board: { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body: { color: 0x4a4845, roughness: 0.5, metalness: 0.7 },
    plunger: { color: 0x44ccff, roughness: 0.3, metalness: 0.4 },
    emissive: { color: 0x00ccff, intensity: 2.2 },
  },
  tritan: {
    label: "Tritanopia",
    bg: 0x0e0e0c,
    fog: [0x0e0e0c, 1200, 2700],
    board: { color: 0x8a8478, roughness: 0.85, metalness: 0.0 },
    body: { color: 0x4a4845, roughness: 0.5, metalness: 0.7 },
    plunger: { color: 0xff6622, roughness: 0.3, metalness: 0.4 },
    emissive: { color: 0xff4400, intensity: 2.2 },
  },
  nearfar: {
    label: "Near / Far Sightedness",
    bg: 0x0a0a08,
    fog: [0x0a0a08, 1200, 2700],
    board: { color: 0x222220, roughness: 1.0, metalness: 0.0 },
    body: { color: 0x333330, roughness: 1.0, metalness: 0.0 },
    plunger: { color: 0xffffff, roughness: 0.9, metalness: 0.0 },
    emissive: { color: 0xffee00, intensity: 3.2 },
  },
  grayscale: {
    label: "Full Grayscale",
    bg: 0x181818,
    fog: [0x181818, 1200, 2700],
    board: { color: 0x303030, roughness: 0.9, metalness: 0.0 },
    body: { color: 0x505050, roughness: 0.7, metalness: 0.0 },
    plunger: { color: 0xcccccc, roughness: 0.5, metalness: 0.0 },
    emissive: { color: 0xffffff, intensity: 2.5 },
  },
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface ThreeSceneHandle {
  setMatrix: (matrix2d: number[][]) => void;
  applyProfile: (key: string) => void;
}

interface ThreeSceneProps {
  onReady?: (handle: ThreeSceneHandle) => void;
  onStatusChange?: (msg: string, isError?: boolean) => void;
  onMatrixChange?: (matrix: Float32Array) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ThreeScene({
  onReady,
  onStatusChange,
  onMatrixChange,
}: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const onMatrixChangeRef = useRef(onMatrixChange);

  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);
  useEffect(() => { onMatrixChangeRef.current = onMatrixChange; }, [onMatrixChange]);

  const setStatus = useCallback(
    (msg: string, isError = false) => {
      onStatusChange?.(msg, isError);
    },
    [onStatusChange]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0c);
    scene.fog = new THREE.Fog(0x0e0e0c, 1200, 2700);

    // ── Camera ────────────────────────────────────────────────────────
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 5000);
    camera.position.set(-300, 360, 500);
    camera.lookAt(0, 0, 0);

    // ── Controls ──────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 150;
    controls.maxDistance = 1500;
    controls.maxPolarAngle = Math.PI / 2;

    // ── Lighting ──────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(80, 200, 100);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -600;
    keyLight.shadow.camera.right = 600;
    keyLight.shadow.camera.top = 600;
    keyLight.shadow.camera.bottom = -600;
    scene.add(keyLight);

    const blueLight = new THREE.DirectionalLight(0x88ccff, 0.5);
    blueLight.position.set(-100, 80, -60);
    scene.add(blueLight);

    const greenLight = new THREE.DirectionalLight(0xa0e060, 0.3);
    greenLight.position.set(0, -50, -150);
    scene.add(greenLight);

    // ── Internal state ────────────────────────────────────────────────
    const plungers: ({ mesh: THREE.Object3D; baseX: number } | null)[] =
      new Array(TOTAL).fill(null);
    const targetMatrix = new Float32Array(TOTAL);
    const currentMatrix = new Float32Array(TOTAL);
    let modelLoaded = false;
    let disposed = false;

    const mats = {
      board: null as THREE.MeshStandardMaterial | null,
      body: null as THREE.MeshStandardMaterial | null,
      plunger: null as THREE.MeshStandardMaterial | null,
      _emissiveColor: new THREE.Color(0xa0e060),
      _emissiveIntensity: 1.8,
    };

    // ── Handle exposed to parent ──────────────────────────────────────
    const handle: ThreeSceneHandle = {
      setMatrix(matrix2d: number[][]) {
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            targetMatrix[row * COLS + col] = matrix2d[row]?.[col] ?? 0;
          }
        }
        onMatrixChangeRef.current?.(targetMatrix);
      },
      applyProfile(key: string) {
        const p = PROFILES[key];
        if (!p) return;

        (scene.background as THREE.Color).setHex(p.bg);
        scene.fog!.color.setHex(p.fog[0]);
        (scene.fog as THREE.Fog).near = p.fog[1];
        (scene.fog as THREE.Fog).far = p.fog[2];

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
      },
    };

    // ── GLB loader ────────────────────────────────────────────────────
    setStatus("loading model...");
    const loader = new GLTFLoader();
    loader.load(
      GLB_PATH,
      (gltf) => {
        if (disposed) return;
        gltf.scene.scale.setScalar(MODEL_SCALE);
        scene.add(gltf.scene);

        const nameMap: Record<string, THREE.Object3D> = {};
        gltf.scene.traverse((obj) => {
          nameMap[obj.name] = obj;
        });

        // Collect all plunger meshes by traversing the scene graph.
        // Blender names: "plunger" (first), "plunger.001"–"plunger.096".
        // Sort by numeric suffix so index 0 = smallest suffix.
        const plungerEntries: { idx: number; mesh: THREE.Object3D }[] = [];
        gltf.scene.traverse((obj) => {
          if (!obj.name.startsWith("plunger")) return;
          const suffix = obj.name.replace("plunger", "");
          // "" → 0, ".001" → 1, ".010" → 10, etc.
          const idx = suffix === "" ? 0 : parseInt(suffix.replace(".", ""), 10);
          plungerEntries.push({ idx, mesh: obj });
        });
        plungerEntries.sort((a, b) => a.idx - b.idx);

        // Wire the first TOTAL (96) plungers to the grid in row-major order
        const toWire = plungerEntries.slice(0, TOTAL);
        let found = 0;
        for (let i = 0; i < toWire.length; i++) {
          const { mesh } = toWire[i];

          if ((mesh as THREE.Mesh).isMesh) {
            if (!mats.plunger) {
              mats.plunger = (
                (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial
              ).clone();
              mats.plunger.color.setHex(0x6aaa3a);
              mats.plunger.roughness = 0.3;
              mats.plunger.metalness = 0.5;
              mats.plunger.emissive = new THREE.Color(0xa0e060);
              mats.plunger.emissiveIntensity = 0;
            }
            (mesh as THREE.Mesh).material = mats.plunger;
            mesh.castShadow = true;
          }

          plungers[i] = { mesh, baseX: mesh.position.x };
          found++;
        }

        // Box — semi-transparent shell
        const box = nameMap["Box"];
        if (box) {
          box.traverse((obj) => {
            if (!(obj as THREE.Mesh).isMesh) return;
            const m = obj as THREE.Mesh;
            m.material = (m.material as THREE.MeshStandardMaterial).clone();
            const mat = m.material as THREE.MeshStandardMaterial;
            mat.transparent = true;
            mat.opacity = 0.18;
            mat.depthWrite = false;
            mat.side = THREE.DoubleSide;
            mat.needsUpdate = true;
            mats.board = mat;
          });
        }

        // Cylinder — transparent
        const cyl = nameMap["cylinder"];
        if (cyl) {
          cyl.traverse((obj) => {
            if (!(obj as THREE.Mesh).isMesh) return;
            const m = obj as THREE.Mesh;
            m.material = (m.material as THREE.MeshStandardMaterial).clone();
            const mat = m.material as THREE.MeshStandardMaterial;
            mat.transparent = true;
            mat.opacity = 0.12;
            mat.depthWrite = false;
            mat.needsUpdate = true;
          });
        }

        // Body material for profile swaps
        ["Corps-Principal:1", "Noyau:1", "Divers:1"].forEach((n) => {
          const obj = nameMap[n];
          if (obj && !mats.body) {
            obj.traverse((child) => {
              if ((child as THREE.Mesh).isMesh && !mats.body) {
                mats.body = (
                  (child as THREE.Mesh)
                    .material as THREE.MeshStandardMaterial
                ).clone();
                (child as THREE.Mesh).material = mats.body;
              }
            });
          }
        });

        modelLoaded = true;
        setStatus(`ready — ${found} plungers wired`);
        onReadyRef.current?.(handle);
      },
      (p) => {
        if (disposed) return;
        if (p.total > 0) {
          setStatus(
            `loading... ${Math.round((p.loaded / p.total) * 100)}%`
          );
        }
      },
      (e) => {
        if (disposed) return;
        console.error(e);
        setStatus("error loading GLB", true);
      }
    );

    // ── Animation loop ────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animFrameId = 0;

    function animate() {
      if (disposed) return;
      animFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (modelLoaded) {
        for (let i = 0; i < TOTAL; i++) {
          const p = plungers[i];
          if (!p) continue;
          currentMatrix[i] +=
            (targetMatrix[i] - currentMatrix[i]) *
            Math.min(dt * LERP_SPEED, 1);
          p.mesh.position.x = p.baseX + currentMatrix[i] * TRAVEL_MM;
        }

        if (mats.plunger) {
          const avg =
            currentMatrix.reduce((s, v) => s + v, 0) / TOTAL;
          mats.plunger.emissive.copy(mats._emissiveColor);
          mats.plunger.emissiveIntensity =
            avg * mats._emissiveIntensity;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ── Resize observer ───────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [setStatus]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 400 }}
    />
  );
}
