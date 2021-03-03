import {
  Color,
  Object3D,
  Vector2,
  MeshStandardMaterial,
  Vector3
} from 'three'

import { gl } from './gl'
import { assets } from './assets'
import { utils } from './utils'
import { physics } from './physics'
import { rainCubes } from './rainCubes'
import { rainObjects } from './rainObjects'
import { BODYSHAPE_MESH, BODYTYPE_STATIC, PASSIVE, COLORS } from './constants'

export const main = async () => {
  assets.queue(
    'helvetiker.typeface.json',
    'portrait.glb',
    'switch.glb'
  )

  await Promise.all([
    physics.init(),
    gl.init(),
    assets.load()
  ])

  rainObjects([
    assets.get('portrait.glb').scene.getObjectByName('Portrait'),
    assets.get('switch.glb').scene
  ])

  rainCubes(10)

  const name = utils.createText('micheal parks')
  const mat = name.material as MeshStandardMaterial
  mat.flatShading = true
  name.receiveShadow = true
  name.castShadow = true
  gl.scene.add(name)

  const light1 = utils.createSpotLight()
  light1.intensity = 10
  light1.position.set(-1, 0.5, 2).multiplyScalar(4)
  light1.color = new Color(COLORS.warmLight)
  light1.lookAt(name.position)
  gl.scene.add(light1)

  const light2 = utils.createSpotLight()
  light2.position.set(1, 2, 2).multiplyScalar(4)
  light2.color = new Color(COLORS.warmestLight)
  gl.scene.add(light2)
  light2.lookAt(name.position)

  const transform2 = new Float32Array(7)
  transform2[0] = name.position.x
  transform2[1] = name.position.y
  transform2[2] = name.position.z
  transform2[3] = name.quaternion.x
  transform2[4] = name.quaternion.y
  transform2[5] = name.quaternion.z
  transform2[6] = name.quaternion.w

  physics.addRigidbodies([name], [{
    id: name.id,
    name: name.name,
    triangles: new Float32Array(name.geometry.getAttribute('position').array),
    type: BODYTYPE_STATIC,
    shape: BODYSHAPE_MESH,
    transform: transform2,
    friction: 0.3,
    restitution: 0.5
  }])

  const title = utils.createText('creative engineer', 0.3)
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
  }, PASSIVE)

  const frame = (dt: number, elapsed: number) => {
    pivot.rotation.y = 2 * -mouse.x / Math.PI / 1.5
    pivot.rotation.x = 2 * mouse.y / Math.PI / 1.5
    physics.update()
  }

  gl.setAnimationLoop(frame)

  let gravityOn = true
  const vec3 = new Vector3()

  document.querySelector('#btn-gravity')?.addEventListener('click', () => {
    if (gravityOn) {
      vec3.set(0, 0, 0)
    } else {
      vec3.set(0, -9.8, 0)
    }

    physics.setGravity(vec3)
    gravityOn = !gravityOn
  })

  // await assets.queue(
  //   '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3',
  //   'background.mp3'
  // ).load()

  // audio.create('1.mp3', false, 0.1)
  // audio.create('2.mp3', false, 0.1)
  // audio.create('3.mp3', false, 0.1)
  // audio.create('4.mp3', false, 0.1)
  // audio.create('5.mp3', false, 0.1)
  // audio.create('6.mp3', false, 0.1)
  // audio.create('background.mp3', true, 0.2)

  // app.on('collisionstart', (data: any) => {
  //   if (data.id === name.id) {
  //     audio.play(`${(Math.random() * 6 | 0) + 1}.mp3`, true)
  //   }
  // })
}

main()
