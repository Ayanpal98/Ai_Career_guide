import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

console.log('Main.tsx: Initializing...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }

  console.log('Main.tsx: Creating root...');
  const root = createRoot(rootElement);
  
  console.log('Main.tsx: Rendering app...');
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log('Main.tsx: Render called successfully');
} catch (error) {
  console.error('Main.tsx: Fatal initialization error:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background-color: #020617; display: flex; align-items: center; justify-content: center; color: white; font-family: sans-serif; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #ef4444; margin-bottom: 1rem;">System Error</h1>
          <p style="color: #94a3b8; margin-bottom: 2rem;">Failed to initialize the application core.</p>
          <pre style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; text-align: left; font-size: 0.8rem; overflow: auto; max-width: 100%;">${error instanceof Error ? error.message : String(error)}</pre>
          <button onclick="window.location.reload()" style="margin-top: 2rem; padding: 0.75rem 1.5rem; bg: #6366f1; border: none; border-radius: 0.5rem; color: white; font-weight: bold; cursor: pointer;">Retry Boot</button>
        </div>
      </div>
    `;
  }
}
