import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'katex/dist/katex.min.css';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register service worker for PWA offline capabilities and installability
if (typeof window !== 'undefined') {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
