import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme' // applies persisted data-theme before first paint
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
