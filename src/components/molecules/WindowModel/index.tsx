import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, type ReactNode, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import {
  AnimationClip,
  AnimationMixer,
  FrontSide,
  type Group,
  LoopOnce,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  Vector3,
} from "three";

import type { ScrollProgress } from "@src/lib/scroll-progress";
import { publicUrl } from "@src/lib/public-url";
import { clipProgressAt } from "@src/lib/window-timeline";

// Modelo e animação vêm do Blender (design/3d/janela). Marco de 1,00 x 1,45 m,
// centro na origem, de frente para +Z. O clip move o Pivo_Oscilobatente (eixo X, aresta
// inferior), a Folha_Movel (eixo Y, lateral esquerda) e a alavanca da maçaneta.
const MODEL_URL = publicUrl("/models/janela.glb");
const CLIP_NAME = "OsciloGiro";

// Com movimento reduzido, a janela fica parada com a oscilobatente aberta.
const REDUCED_MOTION_POSE = 0.25;

// Mesma câmera da Camera_Site do Blender. Abaixo dessa proporção, a câmera recua para a
// folha aberta no giro continuar dentro do quadro.
const CAMERA_POSITION = new Vector3(-1.55, 0.35, 3.4);
const CAMERA_TARGET = new Vector3(-0.2, -0.06, 0.3);
const CAMERA_DISTANCE = 1.1;
const FIT_ASPECT = 0.82;

const POINTER_YAW = 0.14;
const POINTER_PITCH = 0.05;

// Vidro sem o passe de transmissão, para aparelhos mais fracos. three.js não lê classes do
// Tailwind, então a cor vem do token CSS em tempo de execução.
const createLightGlass = () =>
  new MeshPhysicalMaterial({
    color: getComputedStyle(document.documentElement).getPropertyValue("--graphite-50").trim(),
    roughness: 0.05,
    metalness: 0,
    transparent: true,
    opacity: 0.18,
  });

type SceneProps = {
  progress: ScrollProgress;
  reducedMotion: boolean;
  lowPower: boolean;
  onReady: () => void;
};

const CameraRig = () => {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / state.size.height);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const distance = CAMERA_DISTANCE * (aspect < FIT_ASPECT ? FIT_ASPECT / aspect : 1);
    camera.position.copy(CAMERA_POSITION).sub(CAMERA_TARGET).multiplyScalar(distance);
    camera.position.add(CAMERA_TARGET);
    camera.lookAt(CAMERA_TARGET);
    invalidate();
  }, [aspect, camera, invalidate]);

  return null;
};

const WindowRig = ({ progress, reducedMotion, lowPower, onReady }: SceneProps) => {
  const { scene, animations } = useGLTF(MODEL_URL, false, false);
  const rig = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const invalidate = useThree((state) => state.invalidate);
  const canvas = useThree((state) => state.gl.domElement);

  // O GLB exporta tudo com doubleSided, mas cada peça é um sólido fechado com normais para
  // fora: a face de trás nunca aparece e, se aparecesse, seria defeito do modelo a corrigir
  // no Blender (scripts/audit_geometry.py).
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        material.side = FrontSide;
      });
    });
  }, [scene]);

  useLayoutEffect(() => {
    if (!lowPower) return undefined;
    const glass = scene.getObjectByName("Vidro");
    if (!(glass instanceof Mesh)) return undefined;
    const original = glass.material;
    const light = createLightGlass();
    glass.material = light;
    return () => {
      glass.material = original;
      light.dispose();
    };
  }, [scene, lowPower]);

  // O clip fica pausado e o tempo dele é definido pelo scroll: a mesma posição de scroll
  // leva sempre à mesma pose, descendo ou subindo.
  useLayoutEffect(() => {
    const clip = AnimationClip.findByName(animations, CLIP_NAME);
    if (!clip) throw new Error(`Clip ${CLIP_NAME} não encontrado em ${MODEL_URL}`);
    const mixer = new AnimationMixer(scene);
    const action = mixer.clipAction(clip);
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    action.paused = true;

    const apply = () => {
      const pose = reducedMotion ? REDUCED_MOTION_POSE : clipProgressAt(progress.get());
      action.time = pose * clip.duration;
      mixer.update(0);
      invalidate();
    };
    apply();
    const unsubscribe = reducedMotion ? undefined : progress.subscribe(apply);

    return () => {
      unsubscribe?.();
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [scene, animations, progress, reducedMotion, invalidate]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      invalidate();
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
      invalidate();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [canvas, invalidate, reducedMotion]);

  useEffect(onReady, [onReady]);

  // Leve giro do conjunto seguindo o ponteiro. Só pede novos quadros enquanto não assenta.
  useFrame((_, delta) => {
    const group = rig.current;
    if (!group) return;
    const yaw = pointer.current.x * POINTER_YAW;
    const pitch = pointer.current.y * POINTER_PITCH;
    group.rotation.y = MathUtils.damp(group.rotation.y, yaw, 5, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, pitch, 5, delta);
    if (Math.abs(group.rotation.y - yaw) > 1e-4 || Math.abs(group.rotation.x - pitch) > 1e-4) {
      invalidate();
    }
  });

  return (
    <group ref={rig}>
      <primitive object={scene} />
    </group>
  );
};

// Estúdio claro gerado na própria cena: dá reflexos ao PVC e ao vidro sem baixar HDR externo.
// É o mesmo do preview.html do Blender, contra o qual a cor antracita do GLB foi calibrada.
const StudioLight = () => (
  <>
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={4} position={[-3, 2.5, 3]} scale={[4, 3, 1]} />
      <Lightformer form="rect" intensity={2} position={[3, 1, 2]} scale={[3, 4, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[0, 4, -2]} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={0.5} position={[0, -3, 2]} scale={[6, 1, 1]} />
    </Environment>
    <ambientLight intensity={0.3} />
    <directionalLight position={[-2.2, 2.4, 2.6]} intensity={1.8} />
    <ContactShadows
      position={[0, -0.76, 0]}
      scale={3.2}
      resolution={512}
      blur={2.6}
      far={1.4}
      opacity={0.32}
    />
  </>
);

type ModelBoundaryProps = { onError: () => void; children: ReactNode };

// Falha no carregamento do GLB ou no WebGL: a seção continua com a imagem estática.
class ModelBoundary extends Component<ModelBoundaryProps, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onError();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

type WindowModelProps = SceneProps & {
  onError: () => void;
  className?: string;
};

// O Canvas mede o próprio tamanho com react-use-measure. Com o padrão do R3F, essa medição
// tem debounce de 50 ms reiniciado a cada evento de scroll da janela: durante uma rolagem
// contínua (Lenis emite scroll a cada quadro) o tamanho fica 0 x 0 e a cena não monta até o
// usuário parar. Sem acompanhar o scroll e sem debounce, ela monta assim que entra no DOM.
const MEASURE = { scroll: false, debounce: 0 };

export const WindowModel = ({ onError, className, ...scene }: WindowModelProps) => (
  <ModelBoundary onError={onError}>
    <Canvas
      className={className}
      resize={MEASURE}
      frameloop="demand"
      dpr={scene.lowPower ? [1, 1.5] : [1, 2]}
      camera={{ position: CAMERA_POSITION.toArray(), fov: 28, near: 0.05, far: 30 }}
      gl={{ antialias: true, alpha: true, toneMapping: NeutralToneMapping }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
      }}
      aria-hidden="true"
    >
      <CameraRig />
      <Suspense fallback={null}>
        <StudioLight />
        <WindowRig {...scene} />
      </Suspense>
    </Canvas>
  </ModelBoundary>
);

useGLTF.preload(MODEL_URL, false, false);
