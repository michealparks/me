import * as __SNOWPACK_ENV__ from './_snowpack/env.js';

import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  Scene,
  PerspectiveCamera,
  HalfFloatType,
  AmbientLight,
  AudioListener,
  Clock
} from "./_snowpack/pkg/three.js";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAImageLoader,
  SMAAPreset,
  BloomEffect,
  KernelSize
} from "./_snowpack/pkg/postprocessing.js";
import Stats from "./_snowpack/pkg/@drecom/statsjs.js";
import TWEEN from "./_snowpack/pkg/@tweenjs/tweenjs.js";
import {
  COLOR_AMBIENT_LIGHT,
  EXPOSURE,
  FAR,
  FOV,
  NEAR,
  SHADOWMAP
} from "./constants.js";
const renderer = new WebGLRenderer({
  antialias: false,
  depth: false,
  stencil: false,
  powerPreference: "high-performance"
});
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = EXPOSURE;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = SHADOWMAP;
document.body.append(renderer.domElement);
let fn;
let dt = 0, elapsed = 0;
const clock = new Clock();
const stats = new Stats({maxFPS: Infinity, maxMem: Infinity});
const canvas = renderer.domElement;
const composer = new EffectComposer(renderer, {
  frameBufferType: HalfFloatType
});
const scene = new Scene();
let camera = new PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, NEAR, FAR);
const listener = new AudioListener();
scene.add(camera);
camera.add(listener);
if ('production' === "development") {
  document.body.appendChild(stats.dom);
}
const intensity = 1;
const ambientLight = new AmbientLight(COLOR_AMBIENT_LIGHT, intensity);
scene.add(ambientLight);
const init = async () => {
  const bloomEffect = new BloomEffect({
    height: 480,
    intensity: 1.5,
    kernelSize: KernelSize.VERY_LARGE
  });
  const smaaImageLoader = new SMAAImageLoader();
  const [search, area] = await new Promise((resolve) => smaaImageLoader.load(resolve));
  const smaaEffect = new SMAAEffect(search, area, SMAAPreset.ULTRA);
  const effectPass = new EffectPass(camera, smaaEffect, bloomEffect);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(effectPass);
};
const render = () => {
  if (__SNOWPACK_ENV__.MODE === "development") {
    stats.begin();
  }
  dt = clock.getDelta();
  elapsed = clock.getElapsedTime();
  TWEEN.update();
  fn(dt, elapsed);
  const dpi = Math.min(window.devicePixelRatio, 2);
  const width = canvas.clientWidth * dpi | 0;
  const height = canvas.clientHeight * dpi | 0;
  if (canvas.width === width && canvas.height === height) {
    composer.render(dt);
  } else {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    composer.setSize(width, height, false);
  }
  if (__SNOWPACK_ENV__.MODE === "development") {
    stats.end();
  }
};
const setAnimationLoop = (frame) => {
  fn = frame;
  renderer.setAnimationLoop(render);
};
export const gl = {
  stats,
  renderer,
  canvas,
  scene,
  camera,
  ambientLight,
  listener,
  init,
  setAnimationLoop
};
