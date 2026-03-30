import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-icon"></span>
        Ingredia.AI
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/favorites" className="nav-link">
              Favorites
            </Link>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-btn">
              Log in
            </Link>
            <Link to="/signup" className="nav-btn signup-btn">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;