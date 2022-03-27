import { Vector3, Box3 } from 'three'
import { physics } from './physics'

const vec3 = new Vector3()
const box = new Box3()

const getSize = (object: THREE.Object3D, transform: Float32Array) => {
  box.setFromObject(object).getSize(vec3)
  transform[7] = vec3.x / 2
  transform[8] = vec3.y / 2
  transform[9] = vec3.z / 2
}

const setRandomTransform = (object: THREE.Object3D, transform: Float32Array) => {
  const px = (Math.random() - 0.5) * 6
  const py = Math.random() // 7
  const pz = (Math.random() - 0.5) * 6
  const qx = Math.random()
  const qy = Math.random()
  const qz = Math.random()

  object.position.set(px, py, pz)
  object.rotation.set(qx, qy, qz)
  object.updateMatrix()

  transform[0] = px
  transform[1] = py
  transform[2] = pz
  transform[3] = object.quaternion.x
  transform[4] = object.quaternion.y
  transform[5] = object.quaternion.z
  transform[6] = object.quaternion.w

  return transform
}

const setRandomTorque = (id: number, damp = 0.1) => {
  vec3.set(
    (Math.random() - 0.5) * damp,
    (Math.random() - 0.5) * damp,
    (Math.random() - 0.5) * damp
  )
  physics.applyTorqueImpulse(id, vec3)
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
