import {
  Box3,
  Object3D,
  Quaternion,
  Vector2,
  Vector3
} from 'three'

import { gl } from './gl'
import { assets } from './assets'
import { physics } from './physics'
import { rainObjects } from './rainObjects'
import { BODYTYPE_STATIC, PASSIVE, BODYSHAPE_BOX } from './constants'
import { utils } from './utils'

export const main = async () => {
  assets.queue(
    'portrait.glb',
    'switch.glb',
    'name.glb',
    'synth.glb',
    'lego.glb',
    'plant.glb'
  )

  await Promise.all([
    physics.init(),
    gl.init(),
    assets.load()
  ])

  const legoScene = assets.get('lego.glb').scene

  rainObjects([
    assets.get('portrait.glb').scene.getObjectByName('Portrait'),
    assets.get('switch.glb').scene,
    assets.get('synth.glb').scene,
    assets.get('plant.glb').scene,
    legoScene.getObjectByName('Lego1'),
    legoScene.getObjectByName('Lego2'),
    legoScene.getObjectByName('Lego3'),
    legoScene.getObjectByName('Lego4'),
    legoScene.getObjectByName('Lego5'),
  ])

  const mainScene = assets.get('name.glb').scene
  gl.scene.add(mainScene)

  const [light] = mainScene.getObjectByName('Light').children
  light.castShadow = true
  light.shadow.bias = -0.001

  const name = mainScene.getObjectByName('Micheal')
  const title = mainScene.getObjectByName('Title')
  name.receiveShadow = true
  title.receiveShadow = true

  const vec3 = new Vector3()
  const box = new Box3()
  const transform = new Float32Array(10)
  transform[0] = name.position.x
  transform[1] = name.position.y
  transform[2] = name.position.z
  transform[3] = name.quaternion.x
  transform[4] = name.quaternion.y
  transform[5] = name.quaternion.z
  transform[6] = name.quaternion.w

  const bb1 = mainScene.getObjectByName('BoundingBox1')
  box.setFromObject(bb1)
  bb1.visible = false
  box.getSize(vec3)
  transform[7] = vec3.x / 2
  transform[8] = vec3.y / 2
  transform[9] = vec3.z / 2

  const transform2 = new Float32Array(10)
  transform2[0] = title.position.x
  transform2[1] = title.position.y
  transform2[2] = title.position.z
  transform2[3] = title.quaternion.x
  transform2[4] = title.quaternion.y
  transform2[5] = title.quaternion.z
  transform2[6] = title.quaternion.w

  const bb2 = mainScene.getObjectByName('BoundingBox2')
  box.setFromObject(bb2)
  bb2.visible = false
  box.getSize(vec3)
  transform2[7] = vec3.x / 2
  transform2[8] = vec3.y / 2
  transform2[9] = vec3.z / 2

  physics.addRigidbodies([name, title], [{
    id: name.id,
    name: name.name,
    type: BODYTYPE_STATIC,
    shape: BODYSHAPE_BOX,
    transform,
    friction: 0.3,
    restitution: 0.5
  }, {
    id: title.id,
    name: title.name,
    type: BODYTYPE_STATIC,
    shape: BODYSHAPE_BOX,
    transform: transform2,
    friction: 0.3,
    restitution: 0.5
  }])

  const camera = mainScene.getObjectByName('Camera') as Object3D
  gl.camera.position.copy(camera.position)
  gl.camera.quaternion.copy(camera.quaternion.multiply(camera.children[0].quaternion))

  vec3.set(0, -2, 0)
  physics.setGravity(vec3)

  const MOBILE_ZOOM = -5

  let isMobile = false

  const handleResize = () => {
    if (window.innerWidth < 600 && isMobile === false) {
      gl.camera.getWorldDirection(vec3)
      vec3.multiplyScalar(MOBILE_ZOOM)
      gl.camera.position.add(vec3)
      isMobile = true
    } else if (window.innerWidth >= 600 && isMobile === true) {
      gl.camera.getWorldDirection(vec3)
      vec3.multiplyScalar(-MOBILE_ZOOM)
      gl.camera.position.add(vec3)
      isMobile = false
    }
  }

  const pivot = new Object3D()
  gl.scene.add(pivot)
  pivot.attach(gl.camera)

  const pointer = new Vector2()

  const handleMouseMove = (e: MouseEvent) => {
    pointer.x = +(e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault()
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()

    pointer.x = +(e.touches[0].clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
  }

  const dest = new Quaternion()

  const frame = (dt: number, elapsed: number) => {
    dest.z = 2 * pointer.x / Math.PI / 5
    dest.x = 2 * pointer.y / Math.PI / 5

    pivot.rotation.set(dest.x, 0, dest.z)
    physics.update()
  }

  gl.setAnimationLoop(frame)

  handleResize()
  window.addEventListener('resize', utils.debounce(handleResize, 400, true), PASSIVE)
  window.addEventListener('mousemove', handleMouseMove, PASSIVE)
  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchmove', handleTouchMove)

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
