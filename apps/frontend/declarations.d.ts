import { TransitionShaderMaterial } from './path/to/TransitionShader';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      transitionShader: THREE.ShaderMaterial & {
        attach?: string;
        uniforms: {
          currentImage: { value: THREE.Texture };
          time: { value: number };
        };
      };
    }
  }
}
