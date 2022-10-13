import * as THREE from 'three'
import { lights, scene } from 'three-kit'

const ambient = lights.createAmbient()
scene.add(ambient)

// const directional = lights.createDirectional()
// directional.castShadow = true
// directional.intensity = 8.6
// directional.shadow.normalBias = 0.1
// directional.position.set(-2, 2, -2)
// scene.add(directional)

const spot = lights.createSpot()
spot.color = new THREE.Color('#b54546')
spot.shadow.normalBias = 0.1
spot.intensity = 60
spot.castShadow = true
spot.position.set(2, 3, 2)
spot.target.position.set(0, 0, 0)
scene.add(spot)

{
  const { godrayDir } = lights
  godrayDir.position.set(5, 30, 1)
  scene.add(godrayDir)
}
