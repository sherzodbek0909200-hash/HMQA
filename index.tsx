import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Cloudflare Pages va Vercel uchun entrypoint initialization
 */
const init = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("FATAL: Root element topilmadi.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("HMQ Akademiya ilovasi muvaffaqiyatli ishga tushdi.");
  } catch (error) {
    console.error("React render xatosi:", error);
  }
};

// Sahifa yuklanishini kutish
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}