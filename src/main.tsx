import './index.css'
import * as THREE from 'three'
import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './App'
import { ammoLib } from './ammo'

const main = async () => {
  await ammoLib.init()
  ammoLib.setGravity(new THREE.Vector3(0, 0, 0))

  render(
    <StrictMode>
      <App />
    </StrictMode>,
    document.getElementById('root')
  )
}

main()
