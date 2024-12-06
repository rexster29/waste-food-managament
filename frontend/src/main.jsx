import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import instance from '../env.js';
import { swDev } from './swDev.js';

if (instance().APPLICATION_MODE == 'production') {
  createRoot(document.getElementById('root')).render(
    <App />,
  )
}
else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Register the service worker in your main.js
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch(error => {
//         console.log('Service Worker registration failed:', error);
//       });
//   });
// }
swDev();
