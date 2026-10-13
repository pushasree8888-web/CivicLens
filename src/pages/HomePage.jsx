import { ArrowRight, MapPin, Shield, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { sampleComplaints, CATEGORIES } from '../data/sampleData';

const mapPins = [
  { top: '25%', left: '30%', category: 'pothole', style: { animationDelay: '0s' } },
  { top: '45%', left: '55%', category: 'garbage', style: { animationDelay: '0.5s' } },
  { top: '60%', left: '25%', category: 'water', style: { animationDelay: '1s' } },
  { top: '35%', left: '70%', category: 'streetlight', style: { animationDelay: '1.5s' } },
  { top: '70%', left: '65%', category: 'road', style: { animationDelay: '0.8s' } },
];

const features = [
  {
    icon: '📍',
    title: 'Location-Based Reporting',
    description: 'Pin the exact location of civic issues on an interactive map. Make it easy for authorities to find and fix problems fast.',
  },
  {
    icon: '🔔',
    title: 'Real-Time Tracking',
    description: 'Follow your complaint from submission to resolution. Get status updates every step of the way.',
  },
  {
    icon: '📊',
    title: 'Community Analytics',
    description: 'See which issues are most common in your area. Data-driven insights help prioritize civic improvements.',
  },
  {
    icon: '👥',
    title: 'Community Upvoting',
    description: 'Support complaints that matter to you. Higher upvotes signal priority to municipal authorities.',
  },
  {
    icon: '🏛️',
    title: 'Admin Dashboard',
    description: 'Powerful tools for civic bodies to manage, assign, and resolve complaints efficiently.',
  },
  {
    icon: '🔒',
    title: 'Transparent Process',
    description: 'Every action is logged and visible. Hold authorities accountable with a full audit trail.',
  },
];

const getCategoryData = (id) => CATEGORIES.find(c => c.id === id);

export default function HomePage({ onNavigate }) {
  const recentComplaints = sampleComplaints.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text fade-in">
              <div className="hero-badge">
                <span className="dot"></span>
                Civic Tech Platform
              </div>
              <h1 className="hero-title">
                Your Voice.<br />
                Your City.<br />
                <span className="highlight">Your Change.</span>
              </h1>
              <p className="hero-description">
                CivicLens empowers citizens to report potholes, garbage problems, water leakage, and more — directly to municipal authorities. Track progress in real-time and build a better city together.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
                >
                  <MapPin size={18} />
                  Report an Issue
                  <ArrowRight size={16} />
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => { onNavigate('dashboard'); window.scrollTo({ top: 0 }); }}
                >
                  View Dashboard
                </button>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">1,247</span>
                  <span className="hero-stat-label">Issues Reported</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">891</span>
                  <span className="hero-stat-label">Resolved</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">71%</span>
                  <span className="hero-stat-label">Resolution Rate</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="hero-visual">
              <div className="hero-map-card">
                <div className="hero-map-header">
                  <span className="hero-map-title">
                    <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />
                    Live Issue Map
                  </span>
                  <span className="live-indicator">
                    <span className="live-dot"></span>
                    LIVE
                  </span>
                </div>
                {/* Map */}
                <div className="map-placeholder">
                  <div className="map-grid"></div>
                  {mapPins.map((pin, i) => {
                    const cat = getCategoryData(pin.category);
                    return (
                      <div
                        key={i}
                        className="map-pin"
                        style={{
                          top: pin.top,
                          left: pin.left,
                          background: cat?.color + '22',
                          border: `2px solid ${cat?.color}`,
                          ...pin.style,
                        }}
                        title={cat?.label}
                      >
                        {cat?.icon}
                      </div>
                    );
                  })}
                </div>
                {/* Recent complaints */}
                <div className="hero-complaint-list">
                  {recentComplaints.map((c) => {
                    const cat = getCategoryData(c.category);
                    return (
                      <div key={c.id} className="mini-complaint">
                        <div className="mini-complaint-icon">{cat?.icon}</div>
                        <div className="mini-complaint-info">
                          <div className="mini-complaint-title">{c.title}</div>
                          <div className="mini-complaint-loc">📍 {c.location.split(',')[0]}</div>
                        </div>
                        <StatusBadge status={c.status} mini />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section-padding">
        <div className="container">
          <div className="text-center">
            <span className="section-label">✨ Why CivicLens</span>
            <h2 className="heading-lg">Everything you need to fix your city</h2>
            <p className="text-lead" style={{ marginTop: 12, maxWidth: 560, margin: '12px auto 0' }}>
              A complete civic issue management platform that connects citizens with their local government.
            </p>
          </div>
          <div className="features-grid stagger">
            {features.map((f, i) => (
              <div key={i} className="feature-card fade-in">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-description">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--white)',
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            Ready to make a difference?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.0625rem', marginBottom: 32 }}>
            Join thousands of citizens already using CivicLens to improve their communities.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
            >
              <MapPin size={18} />
              Report Your First Issue
            </button>
            <button
              className="btn btn-outline btn-lg"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
              onClick={() => { onNavigate('about'); window.scrollTo({ top: 0 }); }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status, mini }) {
  const configs = {
    pending: { label: 'Pending', class: 'badge-pending' },
    in_progress: { label: 'In Progress', class: 'badge-in_progress' },
    resolved: { label: 'Resolved', class: 'badge-resolved' },
    rejected: { label: 'Rejected', class: 'badge-rejected' },
  };
  const config = configs[status] || configs.pending;
  return (
    <span className={`badge ${config.class}`} style={mini ? { fontSize: '0.65rem', padding: '2px 8px' } : {}}>
      {config.label}
    </span>
  );
}
