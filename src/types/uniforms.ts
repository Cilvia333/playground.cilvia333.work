import * as THREE from 'three';

export interface Uniforms {
  [key: string]: THREE.IUniform;
}

export class UniformsLib {
  static mergeUniforms(...uniforms: (Uniforms | undefined)[]): Uniforms {
    const res = {};

    for (let i = 0; i < uniforms.length; i += 1) {
      if (uniforms[i] !== undefined) {
        Object.assign(res, uniforms[i]);
      }
    }

    return res;
  }
}
