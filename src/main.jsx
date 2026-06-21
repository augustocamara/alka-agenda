import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0f172a;
    color: #f1f5f9;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior: none;
  }
  input, button, select, textarea { font-family: inherit; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
