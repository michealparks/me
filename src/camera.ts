import { renderer, camera } from 'three-kit'

renderer.setClearColor(0x020207)
camera.position.set(2, 4, 3)
camera.lookAt(0, 0, 0)
camera.zoom = 15
camera.near -50
