import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      {/* Redirect any unknown route to the main page - optional based on requirement */}
      {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
    </Routes>
  </Router>
);