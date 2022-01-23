import * as THREE from 'three';

import { Uniforms, UniformsLib } from '~/types/uniforms';

import SimpleVert from '~/utils/shaders/simple.vert?raw';

export class RenderPipeline {
  private renderer: THREE.WebGLRenderer;

  // uniforms
  private commonUniforms: Uniforms;

  // textures
  // private inputTextures: Uniforms;

  private renderTargets: {
    [keys: string]: THREE.WebGLRenderTarget;
  };

  constructor(renderer: THREE.WebGLRenderer, parentUniforms?: Uniforms) {
    this.renderer = renderer;

    /*------------------------
			RenderTargets
		------------------------*/
    this.renderTargets = {
      rt1: new THREE.WebGLRenderTarget(0, 0, {
        stencilBuffer: false,
        generateMipmaps: false,
        depthBuffer: true,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }),
      rt2: new THREE.WebGLRenderTarget(0, 0, {
        depthBuffer: false,
        stencilBuffer: false,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }),
      rt3: new THREE.WebGLRenderTarget(0, 0, {
        depthBuffer: false,
        stencilBuffer: false,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }),
    };

    this.commonUniforms = UniformsLib.mergeUniforms({}, parentUniforms);
  }

  public render(
    scene: THREE.Scene,
    camera: THREE.Camera,
    // renderTarget?: THREE.WebGLRenderTarget,
  ): void {
    /*------------------------
			Scene
		------------------------*/
    const renderTargetMem = this.renderer.getRenderTarget();

    this.renderer.setRenderTarget(this.renderTargets.rt1);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(renderTargetMem);

    this.renderer.autoClear = false;

    /*------------------------
			Composite
		------------------------*/
    const scene2 = new THREE.Scene();
    const camera2 = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0);
    const screen = new THREE.Mesh(new THREE.PlaneBufferGeometry());

    scene2.add(screen);

    const material = new THREE.ShaderMaterial({
      vertexShader: SimpleVert,
      uniforms: UniformsLib.mergeUniforms(this.commonUniforms, {
        sceneTex: { value: this.renderTargets.rt2.texture },
      }),
    });

    screen.material = material;

    const renderTargetMem2 = this.renderer.getRenderTarget();

    this.renderer.setRenderTarget(null);
    this.renderer.render(scene2, camera2);
    this.renderer.setRenderTarget(renderTargetMem2);

    this.renderer.autoClear = true;
  }

  // public resize(pixelWindowSize: THREE.Vector2) {
  //   this.smaaCommonUni.SMAA_RT_METRICS.value.set(
  //     1 / pixelWindowSize.x,
  //     1 / pixelWindowSize.y,
  //     pixelWindowSize.x,
  //     pixelWindowSize.y,
  //   );

  //   this.renderTargets.rt1.setSize(pixelWindowSize.x, pixelWindowSize.y);
  //   this.renderTargets.rt2.setSize(pixelWindowSize.x, pixelWindowSize.y);
  //   this.renderTargets.rt3.setSize(pixelWindowSize.x, pixelWindowSize.y);

  //   for (let i = 0; i < this.bloomRenderCount; i++) {
  //     const size = pixelWindowSize
  //       .clone()
  //       .multiplyScalar(this.bloomResolutionRatio);
  //     size.divideScalar((i + 1) * 2);

  //     this.renderTargets[`rtBlur` + i.toString() + `_0`].setSize(
  //       size.x,
  //       size.y,
  //     );
  //     this.renderTargets[`rtBlur` + i.toString() + `_1`].setSize(
  //       size.x,
  //       size.y,
  //     );
  //   }
  // }
}
