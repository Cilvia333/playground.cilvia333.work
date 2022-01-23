import * as THREE from 'three';

import GPUComputationRenderer from '~/vendor/GPUComputationRenderer';

import materialVert from './shaders/material.vert?raw';
import materialFrag from './shaders/material.frag?raw';

import lifegameFrag from './shaders/lifegame.frag?raw';

const onDay001 = (canvas: HTMLCanvasElement): void => {
  if (!canvas) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const planeWidth = 64;
  const planeHeight = 64;

  const gameScale = 3.0;

  let textureWidth = 0;
  for (let i = 1, l = planeWidth * planeHeight; ; i += 1) {
    const w = 2.0 ** i;
    if (w * w > l) {
      textureWidth = w;
      break;
    }
  }

  // init scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.z = 1000;

  const plane = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      textureLifeGame: { value: null },
      planeSize: { value: new THREE.Vector2(planeWidth, planeHeight) },
      textureSize: { value: new THREE.Vector2(textureWidth, textureWidth) },
    },
    vertexShader: materialVert,
    fragmentShader: materialFrag,
    side: THREE.DoubleSide,
  });
  const gameMesh = new THREE.Mesh(plane, material);
  gameMesh.scale.set(gameScale, gameScale, gameScale);

  scene.add(gameMesh);

  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(width, height);

  const gpuCompute = new GPUComputationRenderer(
    textureWidth,
    textureWidth,
    renderer,
  );
  const textureLifeGame = gpuCompute.createTexture();
  for (let i = 0, l = textureLifeGame.image.data.length; i < l; i += 4) {
    textureLifeGame.image.data[i + 0] = Math.random() < 0.2 ? 1.0 : 0.0;
    textureLifeGame.image.data[i + 1] = 0.0;
    textureLifeGame.image.data[i + 2] = 0.0;
    textureLifeGame.image.data[i + 3] = 0.0;
  }

  const variableLifeGame = gpuCompute.addVariable(
    `textureLifeGame`,
    lifegameFrag,
    textureLifeGame,
  );

  gpuCompute.setVariableDependencies(variableLifeGame, [variableLifeGame]);
  variableLifeGame.material.uniforms.planeSize = {
    value: new THREE.Vector2(planeWidth, planeHeight),
  };

  const error = gpuCompute.init();
  if (error !== null) {
    console.error(error);
  }

  const animate = () => {
    requestAnimationFrame(animate);
    gpuCompute.compute();
    material.uniforms.textureLifeGame.value =
      gpuCompute.getCurrentRenderTarget(variableLifeGame).texture;

    renderer.render(scene, camera);
  };

  animate();
};

export default onDay001;
