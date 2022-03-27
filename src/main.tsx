import './index.css'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './App'
import { ammoLib } from './ammo'

const main = async () => {
  await ammoLib.init()
  ammoLib.setGravity(0, 0, 0)

  render(
    <StrictMode>
      <App />
    </StrictMode>,
    document.querySelector('#root')
  )
}

main()
