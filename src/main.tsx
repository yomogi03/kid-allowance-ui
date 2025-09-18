import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// id="root" と一致させること。nullチェックも忘れずに。
const el = document.getElementById('root')
if (!el) throw new Error('Root element not found')

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)