import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MaterialsList from './components/MaterialsList';
import MaterialPage from './components/MaterialPage';
import MaterialUpload from './components/MaterialUpload';
import SearchBar from './components/SearchBar';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/materials" element={<MaterialsList />} />
        <Route path="/detail/:materialId" element={<MaterialPage />} />
        <Route path="/upload" element={<MaterialUpload />} />
        {/* Uncomment these if needed later */}
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
