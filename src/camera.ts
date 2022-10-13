import * as THREE from 'three'
import { renderer, camera } from 'three-kit'

renderer.setClearColor(new THREE.Color('#020207'))
camera.position.set(2, 4, 3)
camera.lookAt(0, 0, 0)
camera.zoom = 150
camera.near -50
