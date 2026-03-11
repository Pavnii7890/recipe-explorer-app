import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          🍽️ Recipe Explorer
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.username}</span>
              <Link to="/favorites" className="nav-link">Favorites</Link>
              <Link to="/create-recipe" className="nav-link btn btn-primary">Create Recipe</Link>
              <button onClick={handleLogout} className="nav-link btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
