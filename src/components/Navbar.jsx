import { useState, useEffect } from 'react';
import { MapPin, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'Report Issue', page: 'report' },
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'MLA Connect', page: 'mla' },
  { label: 'Rankings', page: 'rankings' },
  { label: 'Admin', page: 'admin' },
  { label: 'About', page: 'about' },
];

export default function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <div className="navbar-logo" onClick={() => handleNav('home')}>
            <div className="logo-icon">CL</div>
            <span className="logo-text">Civic<span>Lens</span></span>
          </div>

          {/* Desktop Nav */}
          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li key={item.page}>
                <span
                  className={`nav-link${currentPage === item.page ? ' active' : ''}`}
                  onClick={() => handleNav(item.page)}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleNav('report')}
            >
              <MapPin size={15} />
              Report Issue
            </button>
            <button
              className="hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        {navItems.map((item) => (
          <div
            key={item.page}
            className={`mobile-nav-link${currentPage === item.page ? ' active' : ''}`}
            onClick={() => handleNav(item.page)}
          >
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: '12px' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => handleNav('report')}
          >
            <MapPin size={16} />
            Report an Issue
          </button>
        </div>
      </div>
    </>
  );
}
