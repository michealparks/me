import {
  LoadingManager,
  TextureLoader,
  AudioLoader,
  FontLoader
} from "./_snowpack/pkg/three.js";
import {GLTFLoader} from "./_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";
const manager = new LoadingManager();
const textureLoader = new TextureLoader();
const audioLoader = new AudioLoader();
const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();
textureLoader.setPath("assets/textures/");
audioLoader.setPath("assets/mp3/");
gltfLoader.setPath("assets/glb/");
fontLoader.setPath("assets/fonts/");
const queued = new Set();
const listeners = new Set();
const promises = new Set();
const cache = new Map();
const loadJSON = async (file) => {
  const response = await fetch(`assets/json/${file}`);
  cache.set(file, await response.json());
};
const loadObj = async (file) => {
  const response = await fetch(`assets/obj/${file}`);
  cache.set(file, await response.text());
};
const loadTexture = async (file) => {
  cache.set(file, await textureLoader.loadAsync(file));
};
const loadAudio = async (file) => {
  cache.set(file, await audioLoader.loadAsync(file));
};
const loadGLTF = async (file) => {
  cache.set(file, await gltfLoader.loadAsync(file));
};
const loadFont = async (file) => {
  cache.set(file, await fontLoader.loadAsync(file));
};
const loadSprite = async (file) => {
  const [data, tex] = await Promise.all([
    fetch(`assets/textures/${file.replace("sprite", "json")}`).then((res) => res.json()),
    textureLoader.loadAsync(file.replace("sprite", "png"))
  ]);
  cache.set(file, {
    frames: data.frames,
    meta: data.meta,
    texture: tex
  });
};
const loadOne = (file) => {
  if (file.includes(".typeface.json")) {
    return loadFont(file);
  }
  switch (file.split(".").pop()) {
    case "glb":
      return loadGLTF(file);
    case "png":
      return loadTexture(file);
    case "mp3":
      return loadAudio(file);
    case "json":
      return loadJSON(file);
    case "sprite":
      return loadSprite(file);
    case "obj":
      return loadObj(file);
  }
};
const get = (file) => {
  return cache.get(file);
};
const queue = (...args) => {
  queueMany(args);
};
const queueMany = (iterable) => {
  for (const file of iterable) {
    queued.add(file);
  }
};
const on = (event, fn) => {
  switch (event) {
    case "load":
      return listeners.add(fn);
  }
};
const load = () => {
  for (const file of queued) {
    promises.add(loadOne(file));
  }
  return Promise.all(promises).then(() => {
    for (const listener of listeners) {
      listener();
    }
    queued.clear();
    promises.clear();
  });
};
export const assets = {
  cache,
  manager,
  textureLoader,
  audioLoader,
  gltfLoader,
  get,
  queue,
  queueMany,
  on,
  load,
  loadOne
};
