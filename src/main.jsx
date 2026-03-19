import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import About from './pages/About.jsx'
import DataMethodology from './pages/DataMethodology.jsx'
import Privacy from './pages/Privacy.jsx'
import ProjectionModels from './pages/ProjectionModels.jsx'
import SystemDiagnostics from './pages/SystemDiagnostics.jsx'
import TermsOfService from './pages/TermsOfService.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/diagnostics" element={<SystemDiagnostics />} />
        <Route path="/projections" element={<ProjectionModels />} />
        <Route path="/methodology" element={<DataMethodology />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
