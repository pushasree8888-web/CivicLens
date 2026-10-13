import { MapPin, ChevronRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const handleNav = (page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>CL</div>
              <span className="footer-logo-text">Civic<span>Lens</span></span>
            </div>
            <p className="footer-tagline">
              Bridging the gap between citizens and civic bodies. Report, track, and resolve issues in your community — one complaint at a time.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">🏆 Hackathon 2024</span>
              <span className="footer-badge">🌐 Civic Tech</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="footer-section-title">Platform</p>
            <ul className="footer-links">
              <li onClick={() => handleNav('home')}>Home</li>
              <li onClick={() => handleNav('report')}>Report an Issue</li>
              <li onClick={() => handleNav('dashboard')}>Complaints Dashboard</li>
              <li onClick={() => handleNav('admin')}>Admin Panel</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="footer-section-title">Categories</p>
            <ul className="footer-links">
              <li>🕳️ Potholes</li>
              <li>🗑️ Garbage</li>
              <li>💧 Water Leakage</li>
              <li>🛣️ Damaged Roads</li>
              <li>💡 Streetlights</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="footer-section-title">Company</p>
            <ul className="footer-links">
              <li onClick={() => handleNav('about')}>About Us</li>
              <li>How it Works</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2024 CivicLens. Built with ❤️ for smarter communities.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span className="footer-copy">Serving communities across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
