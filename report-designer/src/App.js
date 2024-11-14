import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DesignerPage from './components/DesignerPage';
import './App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designer" element={<DesignerPage />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
