import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PartnerReadyPoC from './PartnerReadyPoC'
import './partner-ready-poc.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PartnerReadyPoC />
  </StrictMode>,
)
