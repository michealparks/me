import './index.css'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ammoLib } from './ammo'

const main = async () => {
  await ammoLib.init()
  ammoLib.setGravity(0, 0, 0)

  const root = createRoot(document.querySelector('#root')!)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

main()
