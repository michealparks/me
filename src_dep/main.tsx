import './index.css'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import * as sword from 'sword'

const main = async () => {
  await sword.init(0, 0, 0)
  sword.run()

  createRoot(document.querySelector('#root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

main()
