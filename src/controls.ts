import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { renderer, camera, update, cameraShake } from 'three-kit'

export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2 - 0.3

cameraShake.enable(controls)
cameraShake.maxPitch = 0.05

update(() => {
  controls.update()
})
