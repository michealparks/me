import './index.css'
import { StrictMode, Suspense } from 'react'
import { render } from 'react-dom'
import App from './App'

render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
  document.getElementById('root')
)
