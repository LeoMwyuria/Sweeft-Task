import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { animateHeader } from '../../animations/headerAnimations';

export const Header = () => {
  const location = useLocation();

  useEffect(() => {
    animateHeader();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <>
      <header id="header" className="header">
        <div className="header-content">
          <NavLink to="/" className="logo" onClick={handleLogoClick}>
            Photo Gallery
          </NavLink>
          <nav className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Gallery
            </NavLink>
            <NavLink 
              to="/history" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              History
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};
