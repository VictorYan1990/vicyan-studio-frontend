import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import SocialLinks from '../components/SocialLinks';
import './MainLayout.css';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

const MainLayout: React.FC = () => {
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header-inner">
          <img
            src={`${process.env.PUBLIC_URL}/web_logo.png`}
            alt="VicYan Studio"
            className="site-logo"
          />
          <Link to="/" className="site-wordmark">
            VicYan Studio
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/experience" className={navClass}>
              Experience
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="site-footer-note">© 2026 Victor Yan</p>
        <SocialLinks />
      </footer>
    </div>
  );
};

export default MainLayout;
