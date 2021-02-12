import {
  Audio,
  PositionalAudio
} from "./_snowpack/pkg/three.js";
import {gl} from "./gl.js";
import {assets} from "./assets.js";
const audios = new Map();
const positionals = new Map();
const create = (file, loop = true, volume = 1) => {
  const buffer = assets.get(file);
  const sound = new Audio(gl.listener);
  sound.setBuffer(buffer);
  sound.setLoop(loop);
  sound.setVolume(volume);
  audios.set(file, sound);
  return audio;
};
const createPositional = async (file, parent, refDistance = 1, loop = true, volume = 1) => {
  const buffer = assets.get(file);
  const sound = new PositionalAudio(gl.listener);
  sound.setBuffer(buffer);
  sound.setRefDistance(refDistance);
  sound.setLoop(loop);
  sound.setVolume(volume);
  positionals.set(file, sound);
  parent.add(sound);
  return audio;
};
const get = (key) => {
  let audio2 = positionals.get(key);
  if (audio2 === void 0) {
    audio2 = audios.get(key);
  }
  if (audio2 === void 0) {
    throw new Error(`Audio ${key} is undefined.`);
  }
  return audio2;
};
const setLoop = (key, loop) => {
  get(key).setLoop(loop);
};
const play = (key, force = false) => {
  const audio2 = get(key);
  if (force === true) {
    if (audio2.isPlaying === true) {
      audio2.stop();
    }
    audio2.play();
  } else if (audio2.isPlaying === false) {
    audio2.play();
  }
};
const stop = (key) => {
  get(key).stop();
};
export const audio = {
  create,
  createPositional,
  play,
  get,
  setLoop,
  stop
};
