import { createRoot } from 'react-dom/client'
import './formengine-config.js'
import './styles/global.css'
import './styles/remove-blue-div.css'
import App from './App.jsx'

createRoot(document.getElementById('root')!).render(
  <App />
)