
<script lang='ts'>

import { useThrelte, useFrame } from '@threlte/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CameraShake } from 'trzy'

const { renderer, camera } = useThrelte()

$camera.position.set(2, 4, 3)
$camera.lookAt(0, 0, 0)

const controls = new OrbitControls($camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.025
controls.enableZoom = false
controls.enablePan = false

const shake = new CameraShake($camera as THREE.PerspectiveCamera, controls)
shake.intensity = 0.5

useFrame(() => {
  controls.update()
  shake.update()
})

</script>
