
<script lang='ts'>

import { T, useThrelte, useFrame } from '@threlte/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CameraShake } from 'trzy'

const { renderer } = useThrelte()

let controls: OrbitControls
let shake: CameraShake

const { start } = useFrame((_, delta) => {
  controls.update()
  shake.update(delta)
})

const handleCreate = ({ ref }: { ref: THREE.PerspectiveCamera }) => {
  ref.lookAt(0, 0, 0)

  controls = new OrbitControls(ref, renderer?.domElement)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.enablePan = false
  controls.maxPolarAngle = Math.PI / 2 - 0.3
  controls.maxDistance = 9
  controls.minDistance = 9

  shake = new CameraShake(ref)
  shake.enable(controls)
  start()
}

const n = 4

</script>

<T.PerspectiveCamera
  makeDefault
  position={[n, n + 2, n + 1]}
  on:create={handleCreate}
/>
