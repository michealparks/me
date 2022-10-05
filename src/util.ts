import * as THREE from 'three'
import * as sword from 'sword'

const m4 = new THREE.Matrix4()
const euler = new THREE.Euler()
const position = new THREE.Vector3()
const quaternion = new THREE.Quaternion()

export const createRandomTransform = (p = position, q = quaternion) => {
  euler.x = Math.random() * Math.PI
  euler.y = Math.random() * Math.PI
  euler.z = Math.random() * Math.PI
  q.setFromEuler(euler, true)
  m4.makeRotationFromQuaternion(q)

  p.x = (Math.random() - 0.5) * 6
  p.y = Math.random() // 7
  p.z = (Math.random() - 0.5) * 6
  m4.setPosition(p)

  return m4
}

export const setRandomTorque = (id: number, damp = 0.1) => {
  const impulses = new Float32Array(3)
  impulses[0] = (Math.random() - 0.5) * damp
  impulses[1] = (Math.random() - 0.5) * damp
  impulses[2] = (Math.random() - 0.5) * damp
  sword.applyTorqueImpulses(new Uint16Array(id), impulses)
}
