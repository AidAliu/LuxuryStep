import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for ReactDOM
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Get the root element in your HTML file
const rootElement = document.getElementById('root');

// Create a React root and render the App
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorker.unregister();
