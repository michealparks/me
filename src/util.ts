import * as THREE from 'three'

const r = (scale = 1) => (Math.random() - 0.5) * scale
const rp = (scale = 1) => Math.random() > 0.5
  ? ((Math.random() * 0.5) - 0.5) * scale
  : ((Math.random() * 0.5) + 0.5) * scale

export const randomTransform = (event: { ref: THREE.Group }) => {
  const { rotation, position } = event.ref
  rotation.x = Math.random() * Math.PI
  rotation.y = Math.random() * Math.PI
  rotation.z = Math.random() * Math.PI
  position.x = rp() * 3
  position.y = rp() * 3
  position.z = rp() * 3
  event.ref.updateMatrix()
  event.ref.updateMatrixWorld()
}

export const randomVelocities = (): {
  linearVelocity: [x: number, y: number, z: number]
  angularVelocity: [x: number, y: number, z: number]
} => {
  return {
    linearVelocity: [r(0.1), r(0.1), r(0.1)],
    angularVelocity: [r(), r(), r()],
  }
}
