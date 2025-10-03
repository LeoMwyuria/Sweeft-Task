import { Outlet, NavLink } from 'react-router-dom';

export const Header = () => {
  return (
    <div className="app">
      <nav className="navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};