import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSquad } from '../context/SquadContext';
import './Navbar.css';

const Navbar = () => {
  const { filledCount } = useSquad();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">
            FOOTBALL<span className="logo-accent">GAME</span>
          </span>
          <span className="badge badge-green v1-badge">V1</span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/leagues"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Leagues & Clubs
          </NavLink>
          <NavLink
            to="/squad"
            className={({ isActive }) => `nav-link nav-link-squad ${isActive ? 'active' : ''}`}
          >
            Squad Builder
            <span className="squad-counter">{filledCount}/11</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
