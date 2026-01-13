import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Ensure the DOM is fully loaded before mounting
const init = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element not found. The app cannot start.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React rendering error:", error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Dastur yuklanishida xatolik yuz berdi</h2>
        <p>Iltimos, sahifani yangilang yoki brauzer konsolini tekshiring.</p>
        <pre style="text-align: left; background: #111; padding: 10px; border-radius: 5px; overflow: auto;">${error}</pre>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
