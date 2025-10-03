import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import gsap from 'gsap';

export const Header = () => {
  useEffect(() => {
    gsap.fromTo("#header", 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

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
