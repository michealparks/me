import * as THREE from 'three'
import * as sword from 'sword'

const vec3 = new THREE.Vector3()
const box = new THREE.Box3()

const getSize = (object: THREE.Object3D) => {
  box.setFromObject(object).getSize(vec3)
  return vec3
}

const setRandomTransform = (object: THREE.Object3D) => {
  const px = (Math.random() - 0.5) * 6
  const py = Math.random() // 7
  const pz = (Math.random() - 0.5) * 6
  const qx = Math.random()
  const qy = Math.random()
  const qz = Math.random()

  object.position.set(px, py, pz)
  object.rotation.set(qx, qy, qz)
}

const setRandomTorque = (id: number, damp = 0.1) => {
  const impulses = new Float32Array(3)
  impulses[0] = (Math.random() - 0.5) * damp
  impulses[1] = (Math.random() - 0.5) * damp
  impulses[2] = (Math.random() - 0.5) * damp
  sword.applyTorqueImpulses(new Uint16Array(id), impulses)
}

const shuffleArray = <Type>(arr: Type[]): Type[] => {
  let i = arr.length - 1
  let j = 0
  let temp

  while (i > 0) {
    j = Math.trunc(Math.random() * (i + 1))
    temp = arr[i]
    arr[i] = arr[j]!
    arr[j] = temp!

    i -= 1
  }

  return arr
}

const debounce = (fn: (...args: unknown[]) => void, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout>
	return function (this: unknown, ...args: unknown[]) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn.apply(this, args), ms)
	}
}

const memoize = <Type>(fn: (val: unknown) => void) => {
	const cache = new Map()
	const cached = function (this: unknown, val: Type) {
		return cache.has(val)
			? cache.get(val)
			: cache.set(val, fn.call(this, val)) && cache.get(val)
	}
	cached.cache = cache
	return cached
}

export const utils = {
  getSize,
  setRandomTransform,
  setRandomTorque,
  shuffleArray,
  debounce,
  memoize,
}
