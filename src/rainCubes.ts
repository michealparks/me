import type {
  Mesh
} from 'three'

import { gl } from './gl'
import { physics } from './physics'
import { BODYTYPE_DYNAMIC, BODYSHAPE_BOX } from './constants'
import { utils } from './utils'
import type { Rigidbody } from './types'

const rainCubes = async (numCubes = 50, i = 0) => {
  const template = utils.createCube(0.5)
  template.castShadow = true
  template.receiveShadow = true

  const cubes: Mesh[] = []

  const rigidbodies: Rigidbody[] = []
  for (i = 0; i < numCubes; i++) {
    const cube = template.clone() as Mesh
    const transform = new Float32Array(10)
    utils.setRandomTransform(cube, transform)
    transform[7] = transform[8] = transform[9] = 0.25

    cube.updateMatrix()

    rigidbodies.push({
      id: cube.id,
      name: cube.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9
    })

    gl.scene.add(cube)
    cubes.push(cube)
  }

  physics.addRigidbodies(cubes, rigidbodies)

  i = 0

  setInterval(() => {
    const cube = cubes[i]

    const transform = new Float32Array(7)
    utils.setRandomTransform(cube, transform)

    physics.teleport(cube.id, transform, true)

    i += 1
    i %= (numCubes - 1)
  }, 500)
}

export { rainCubes }
