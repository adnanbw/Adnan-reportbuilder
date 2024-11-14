import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DesignerPage from './components/DesignerPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designer" element={<DesignerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
