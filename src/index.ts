import {
  Object3D,
  Vector2,
  Vector3
} from 'three'

import { gl } from './gl'
import { assets } from './assets'
import { utils } from './utils'
import { physics } from './physics'
import { rainCubes } from './rainCubes'
import { BODYSHAPE_MESH, BODYTYPE_STATIC } from './constants'

export const main = async () => {
  const vec = new Vector3()

  assets.queue(
    'helvetiker.typeface.json'
  )

  await Promise.all([
    physics.init(),
    gl.init(),
    assets.load()
  ])

  rainCubes(100)

  const light = utils.createPointLight()
  light.position.set(2, 2, 2)
  gl.scene.add(light)

  const name = utils.createText('micheal parks')
  gl.scene.add(name)
  name.geometry.boundingBox?.getSize(vec)

  const transform = new Float32Array(10)
  transform[0] = name.position.x
  transform[1] = name.position.y
  transform[2] = name.position.z
  transform[3] = name.quaternion.x
  transform[4] = name.quaternion.y
  transform[5] = name.quaternion.z
  transform[6] = name.quaternion.w
  transform[7] = vec.x
  transform[8] = vec.y
  transform[9] = vec.z

  physics.addRigidbodies([name], [{
    id: name.id,
    name: name.name,
    triangles: new Float32Array(name.geometry.getAttribute('position').array),
    type: BODYTYPE_STATIC,
    shape: BODYSHAPE_MESH,
    transform,
    mass: 0,
    linearDamping: 0,
    angularDamping: 0,
    friction: 0.3,
    restitution: 0.5,
    enabled: true
  }])

  const title = utils.createText('software engineer', 0.3)
  title.position.setY(-0.6)
  gl.scene.add(title)

  gl.camera.position.set(0, 0, 15)
  gl.camera.lookAt(0, 0, 0)

  const pivot = new Object3D()
  gl.scene.add(pivot)
  pivot.attach(gl.camera)

  const mouse = new Vector2()

  window.addEventListener('mousemove', (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  })

  const frame = (dt: number, elapsed: number) => {
    pivot.rotation.y = 2 * -mouse.x / Math.PI / 1.5
    pivot.rotation.x = 2 * mouse.y / Math.PI / 1.5
    physics.update()
  }

  gl.setAnimationLoop(frame)
}

main()
