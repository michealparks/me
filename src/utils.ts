import type {
  Object3D
} from 'three'

const setRandomTransform = (object: Object3D, transform: Float32Array) => {
  const px = Math.random() * 4 - 3, py = 7, pz = 0
  const qx = Math.random(), qy = Math.random(), qz = Math.random()

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
  transform[7] = transform[8] = transform[9] = 0.25

  return transform
}

const shuffleArray = (arr: Array<any>) => {
  let i = arr.length - 1
  let j = 0
  let temp

  while (i > 0) {
    j = Math.random() * (i + 1) | 0
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp

    i -= 1
  }

  return arr
}

const debounce = (fn: Function, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout>
	return function (this: any, ...args: any[]) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn.apply(this, args), ms)
	}
}

const memoize = <T = any>(fn: Function) => {
	const cache = new Map()
	const cached = function (this: any, val: T) {
		return cache.has(val)
			? cache.get(val)
			: cache.set(val, fn.call(this, val)) && cache.get(val)
	}
	cached.cache = cache
	return cached
}

export const utils = {
  setRandomTransform,
  shuffleArray,
  debounce,
  memoize
}
