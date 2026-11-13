import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Cores dos tokens (graphite-800, graphite-950, graphite-300, sky-300). three.js não lê CSS.
const COLORS = {
  pvc: "#2c3439",
  gasket: "#111417",
  metal: "#c4c8cb",
  glass: "#9cc3d5",
};

export type WindowPose = {
  tilt: number; // 0 a 1: tombar (ventilação)
  turn: number; // 0 a 1: girar (abertura total)
};

export type WindowScene = {
  setPose: (pose: WindowPose) => void;
  setPointer: (x: number, y: number) => void;
  start: () => void;
  stop: () => void;
  resize: () => void;
  dispose: () => void;
};

const MAX_TILT = MathUtils.degToRad(11);
const MAX_TURN = MathUtils.degToRad(78);

const materialFor = (name: string) => {
  if (name.startsWith("Glass")) {
    return new MeshPhysicalMaterial({
      color: COLORS.glass,
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.22,
      envMapIntensity: 1.4,
      clearcoat: 1,
      depthWrite: false,
    });
  }
  if (name.startsWith("Handle")) {
    return new MeshStandardMaterial({ color: COLORS.metal, roughness: 0.26, metalness: 1 });
  }
  if (name.includes("Gasket") || name.includes("Stop")) {
    return new MeshStandardMaterial({ color: COLORS.gasket, roughness: 0.85 });
  }
  return new MeshStandardMaterial({ color: COLORS.pvc, roughness: 0.46, metalness: 0.05 });
};

export const createWindowScene = async (
  canvas: HTMLCanvasElement,
  modelUrl: string,
): Promise<WindowScene> => {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  pmrem.dispose();

  const key = new DirectionalLight(new Color("#ffffff"), 1.6);
  key.position.set(-2.5, 3, 3);
  scene.add(key);

  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  const target = new Vector3();

  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const model = gltf.scene;
  model.traverse((child: Object3D) => {
    if (child instanceof Mesh) child.material = materialFor(child.name);
  });

  const tiltPivot = model.getObjectByName("Tilt_Pivot");
  const turnPivot = model.getObjectByName("Turn_Pivot");
  const lever = model.getObjectByName("Handle_Lever");
  const rose = model.getObjectByName("Handle_Rose");

  // A alavanca gira em torno do espelho da maçaneta, não do próprio centro.
  const leverPivot = new Group();
  if (lever && rose && turnPivot) {
    leverPivot.position.copy(rose.position);
    turnPivot.add(leverPivot);
    lever.position.sub(rose.position);
    leverPivot.add(lever);
  }

  const root = new Group();
  root.add(model);
  scene.add(root);
  const box = new Box3().setFromObject(model);
  box.getCenter(target);
  camera.position.set(target.x - 1.55, target.y + 0.35, target.z + 3.4);
  camera.lookAt(target);

  const pose: WindowPose = { tilt: 0, turn: 0 };
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  let frame = 0;

  const render = () => {
    pointer.cx += (pointer.x - pointer.cx) * 0.06;
    pointer.cy += (pointer.y - pointer.cy) * 0.06;
    root.rotation.y = pointer.cx * 0.18;
    root.rotation.x = pointer.cy * 0.06;
    if (tiltPivot) tiltPivot.rotation.x = -pose.tilt * MAX_TILT;
    if (turnPivot) turnPivot.rotation.y = -pose.turn * MAX_TURN;
    // Maçaneta: para baixo fechada, horizontal para girar, para cima para tombar.
    leverPivot.rotation.z = pose.tilt > 0 ? -Math.PI * pose.tilt : (-Math.PI / 2) * pose.turn;
    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    frame = requestAnimationFrame(loop);
  };

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    render();
  };

  resize();

  return {
    setPose: (next) => {
      pose.tilt = MathUtils.clamp(next.tilt, 0, 1);
      pose.turn = MathUtils.clamp(next.turn, 0, 1);
    },
    setPointer: (x, y) => {
      pointer.x = x;
      pointer.y = y;
    },
    start: () => {
      if (!frame) frame = requestAnimationFrame(loop);
    },
    stop: () => {
      cancelAnimationFrame(frame);
      frame = 0;
    },
    resize,
    dispose: () => {
      cancelAnimationFrame(frame);
      model.traverse((child: Object3D) => {
        if (!(child instanceof Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      });
      envTexture.dispose();
      renderer.dispose();
    },
  };
};
