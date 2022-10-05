import './main.css'
import 'sword/debug'
import * as THREE from 'three'
import * as sword from 'sword'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { camera, cameraShake, renderer, run, update } from 'three-kit'
import './lights'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2 - 0.3

renderer.setClearColor(new THREE.Color('#020207'))
camera.position.set(2, 4, 3)
camera.lookAt(0, 0, 0)


await sword.init(0, 0, 0)
const name = await import('./objects/name')
sword.run()
run()

const [lego, picture, nintendo, synth, houseplant] = await Promise.all([
  import('./objects/lego'),
  import('./objects/picture'),
  import('./objects/switch'),
  import('./objects/synth'),
  import('./objects/houseplant'),
])

const ids = [...lego.ids, picture.id, nintendo.id, synth.id, houseplant.id] as number[]
const impulses = new Float32Array(ids.length * 3)
const damp = 0.001

for (let i = 0, l = ids.length * 3; i < l; i += 3) {
  impulses[i + 0] = (Math.random() - 0.5) * damp
  impulses[i + 1] = (Math.random() - 0.5) * damp
  impulses[i + 2] = (Math.random() - 0.5) * damp
}

sword.applyTorqueImpulses(new Uint16Array(ids), impulses)

window.addEventListener('mousedown', () => {
  // const forces = new Float32Array(ids.length * 6)
  // for (let i = 0, l = ids.length * 3; i < l; i += 6) {
  //   forces[i + 0] = 
  // }

  // sword.setForces(new Uint16Array(ids), forces)
})

update(() => {
  controls.update()
})

cameraShake.enable(controls)
cameraShake.maxPitch = 0.05

requestIdleCallback(() => {
  document.querySelector('.loading')!.setAttribute('style', 'display:none;')
})

