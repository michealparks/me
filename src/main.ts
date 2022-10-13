if (import.meta.env.DEV) {
  import('sword/debug')
}

import './main.css'
import * as sword from 'sword'
import { run } from 'three-kit'
import './camera'
import './lights'
import './controls'

await sword.init(0, 0, 0)

const [lego, picture, nintendo, synth, houseplant] = await Promise.all([
  import('./objects/lego'),
  import('./objects/picture'),
  import('./objects/switch'),
  import('./objects/synth'),
  import('./objects/houseplant'),
  import('./objects/name')
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

// window.addEventListener('mousedown', () => {
//   const forces = new Float32Array(ids.length * 6)
//   for (let i = 0, l = ids.length * 3; i < l; i += 6) {
//     forces[i + 0] = 
//   }

//   sword.setForces(new Uint16Array(ids), forces)
// })

sword.run()
run()

requestIdleCallback(() => {
  document.querySelector('.loading')!.remove()
})
