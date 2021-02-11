import {
  Mesh,
  MeshStandardMaterial,
  BoxGeometry
} from 'three'

import { gl } from './gl'

export const main = async () => {
  await gl.init()

  const mesh = new Mesh(
    new BoxGeometry(1, 1, 1, 1),
    new MeshStandardMaterial({ color: 0x000000 })
  )

  gl.scene.add(mesh)

  gl.camera.position.set(0, 0, 3)
  gl.camera.lookAt(mesh.position)

  const frame = (dt: number, elapsed: number) => {
    console.log(elapsed)
    mesh.rotation.x = elapsed
    mesh.rotation.y = elapsed
  }

  gl.setAnimationLoop(frame)
}

main()