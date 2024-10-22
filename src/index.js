import React from 'react';

import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Project from './project';
import App from './App';
import Log from './Log';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <New/>
  <Router>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Log/>} />
    <Route path="/assignment" element={<Project/>} />
    <Route path="/App" element={<App/>} />
    </Routes>
  </Router>
);

