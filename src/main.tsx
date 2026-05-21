import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { postaviSwUpdate } from './lib/sw-update';
import './index.css';

// Service worker registracija + update detekcija. Vidi src/lib/sw-update.ts
// za detalje pattern-a (polling, onNeedRefresh callback, anti-Safari mjere).
const swController = postaviSwUpdate();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App swController={swController} />
  </StrictMode>,
);
