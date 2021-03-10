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

const debounce = (fn: any, wait: number, immediate: boolean) => {
	let timeout: NodeJS.Timeout | null

	return (...args: any) => {
		const later = () => {
			timeout = null
			if (immediate === false) fn(...args)
		}

		if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }

    const callNow = immediate && timeout === null

		timeout = setTimeout(later, wait)

		if (callNow) {
      fn(...args)
    }
	}
}

export const utils = {
  setRandomTransform,
  shuffleArray,
  debounce,
}
