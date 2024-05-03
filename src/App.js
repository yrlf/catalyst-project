import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MaterialsList from './components/MaterialsList';
import MaterialPage from './components/MaterialPage';
import MaterialUpload from './components/MaterialUpload';
import SearchBar from './components/SearchBar';
import About from './components/About';
import Contact from './components/Contact';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<MaterialsList />} />
        <Route path="/detail/:materialId" element={<MaterialPage />} />
        <Route path="/upload" element={<MaterialUpload />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
