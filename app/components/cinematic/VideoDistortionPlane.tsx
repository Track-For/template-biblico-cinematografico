"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type DistortionProps = {
  video: HTMLVideoElement;
  progress: MutableRefObject<number>;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform float uViewportAspect;
  uniform float uTextureAspect;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    vec2 ratio = vec2(
      min(uViewportAspect / uTextureAspect, 1.0),
      min(uTextureAspect / uViewportAspect, 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    float arc = sin(uProgress * 3.14159265);
    vec2 uv = coverUv(vUv);
    float wave = sin((uv.y * 25.0) + (uProgress * 10.0)) * 0.006 * arc;
    float shear = (uv.y - 0.5) * 0.018 * arc;
    vec2 warped = uv + vec2(wave + shear, 0.0);
    float split = 0.0035 * arc;
    float red = texture2D(uTexture, warped + vec2(split, 0.0)).r;
    float green = texture2D(uTexture, warped).g;
    float blue = texture2D(uTexture, warped - vec2(split, 0.0)).b;
    gl_FragColor = vec4(red, green, blue, 1.0);
  }
`;

type DistortionMeshProps = DistortionProps & {
  reportReady: () => void;
};

function DistortionMesh({ video, progress, reportReady }: DistortionMeshProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const reportedReady = useRef(false);
  const texture = useMemo(() => {
    const nextTexture = new THREE.VideoTexture(video);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.minFilter = THREE.LinearFilter;
    nextTexture.magFilter = THREE.LinearFilter;
    nextTexture.generateMipmaps = false;
    return nextTexture;
  }, [video]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uProgress: { value: 0 },
      uViewportAspect: { value: 16 / 9 },
      uTextureAspect: {
        value: video.videoWidth && video.videoHeight
          ? video.videoWidth / video.videoHeight
          : 16 / 9,
      },
    }),
    [texture, video],
  );

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ size }) => {
    if (!material.current) return;
    material.current.uniforms.uProgress.value = progress.current;
    material.current.uniforms.uViewportAspect.value = size.width / size.height;

    if (
      !reportedReady.current &&
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      reportedReady.current = true;
      reportReady();
    }
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function VideoDistortionPlane(props: DistortionProps) {
  const [ready, setReady] = useState(false);
  const reportReady = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <div
      className={`distortion-plane${ready ? " distortion-plane--ready" : ""}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        orthographic
        camera={{
          position: [0, 0, 1],
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          near: 0.1,
          far: 10,
          zoom: 1,
        }}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      >
        <DistortionMesh {...props} reportReady={reportReady} />
      </Canvas>
    </div>
  );
}
