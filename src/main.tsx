import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Landing from './Landing'
import './styles.css'
import './theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
)
