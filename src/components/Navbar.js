import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={brandStyle}>
        <Link to="/" style={linkStyle}>MaterialDB</Link>
      </div>
      <ul style={navListStyle}>
        <li style={navItemStyle}><Link to="/" style={linkStyle}>Home</Link></li>
        <li style={navItemStyle}><Link to="/materials" style={linkStyle}>Materials</Link></li>
        <li style={navItemStyle}><Link to="/upload" style={linkStyle}>Upload</Link></li> 
        <li style={navItemStyle}><Link to="/about" style={linkStyle}>About</Link></li>
        <li style={navItemStyle}><Link to="/contact" style={linkStyle}>Contact</Link></li>
      </ul>
    </nav>
  );
}

// Styles
const navStyle = {
  backgroundColor: '#004d40',
  color: 'white',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const brandStyle = {
  fontWeight: 'bold',
  fontSize: '1.5em'
};

const navListStyle = {
  listStyleType: 'none',
  display: 'flex',
};

const navItemStyle = {
  margin: '0 10px'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none'
};

export default Navbar;
