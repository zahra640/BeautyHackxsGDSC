import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import icon from '../assets/iconBH.png';   


export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    logout();
    navigate('/');
  };
  
  return (
    <>
      <header>
        <div className="logo-container">
          <NavLink to="/"><img src={icon} className="logo" alt="Beauty Hackxs" /></NavLink>
        </div>
        <nav>
          <ul>
            <li><NavLink exact to="/" activeClassName="active">About Us</NavLink></li>
            <li><NavLink to="/ingredients" activeClassName="active">Ingredients</NavLink></li>
            <li>
              {user ? (
                <button onClick={handleSignOut} className="sign-in-btn">
                  Sign Out
                </button>
              ) : (
                <NavLink to="/signin" className="sign-in-btn" activeClassName="active">Sign In</NavLink>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2025 Beauty Hackxs. All rights reserved.</p>
      </footer>
    </>
  );
}
