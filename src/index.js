import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const observerErrorHandler = (e) => {
    if (e.message.includes('ResizeObserver')) {
      // Ignore
      return;
    }
    throw e;
  };
  
  window.addEventListener('error', observerErrorHandler);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

