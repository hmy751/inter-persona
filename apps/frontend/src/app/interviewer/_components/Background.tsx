// import TransitionShader from "@/shader/TransitionShader";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import * as THREE from "three";
import glsl from "glslify";

const TransitionShader = shaderMaterial(
  {
    time: 0,
    currentImage: new THREE.Texture(),
  },
  glsl`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  glsl`
  varying vec2 vUv;
  uniform sampler2D currentImage;
  uniform float time;

  void main() {
    vec2 uv = vUv;

    float distortion = sin(uv.y * 1.4 + time * 5.0) * 0.1;

    vec2 distortedUv = vec2(uv.x + distortion, uv.y);

    vec4 color = texture2D(currentImage, distortedUv);

    gl_FragColor = color;
  }
  `
);

extend({ TransitionShader });

const Background: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const imageTexture = useTexture(imageUrl);
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;

      material.uniforms.currentImage.value = imageTexture;

      material.needsUpdate = true;

      material.dispose();
      material.needsUpdate = true;
      material.uniformsNeedUpdate = true;
    }
  }, [imageTexture]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <planeGeometry args={[10, 8]} />
      <transitionShader
        attach="material"
        uniforms={{
          time: { value: 0 },
          currentImage: { value: imageTexture },
        }}
      />
    </mesh>
  );
};

export default Background;
