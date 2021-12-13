import {
  Object3D,
  Audio,
  PositionalAudio,
  AudioListener
} from 'three'

import { assets } from './assets'

const audios = new Map<string, Audio>()
const positionals = new Map<string, PositionalAudio>()

const create = (listener: THREE.AudioListener, file: string, loop = true, volume = 1) => {
  const buffer = assets.get(file)
  const sound = new Audio(listener)
  sound.setBuffer(buffer)
  sound.setLoop(loop)
  sound.setVolume(volume)
  audios.set(file, sound)
  return audio
}

const createPositional = async (listener: THREE.AudioListener, file: string, parent: Object3D, refDistance = 1, loop = true, volume = 1) => {
  const buffer = assets.get(file)
  const sound = new PositionalAudio(listener)
  sound.setBuffer(buffer)
  sound.setRefDistance(refDistance)
  sound.setLoop(loop)
  sound.setVolume(volume)
  positionals.set(file, sound)
  parent.add(sound)
  return audio
}

const get = (key: string) => {
  let audio: any = positionals.get(key)

  if (audio === undefined) {
    audio = audios.get(key)
  }

  if (audio === undefined) {
    throw new Error(`Audio ${key} is undefined.`)
  }

  return audio
}

const setLoop = (key: string, loop: boolean) => {
  get(key).setLoop(loop)
}

const play = (key: string, force = false) => {
  const audio = get(key)
  
  if (force === true) {
    if (audio.isPlaying === true) {
      audio.stop()
    }

    audio.play()
  }
  else if (audio.isPlaying === false) {
    audio.play()
  }
}

const stop = (key: string) => {
  get(key).stop()
}

export const audio = {
  create,
  createPositional,
  play,
  get,
  setLoop,
  stop
}
