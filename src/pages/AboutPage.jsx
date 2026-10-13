import { MapPin, ArrowRight } from 'lucide-react';

const teamMembers = [
  { name: 'Aarav Sharma', role: 'Full Stack Developer', emoji: '💻' },
  { name: 'Priya Nair', role: 'UI/UX Designer', emoji: '🎨' },
  { name: 'Rohan Mehta', role: 'Backend Engineer', emoji: '⚙️' },
];

const values = [
  {
    icon: '🌍',
    title: 'Community First',
    text: 'Every feature is designed with the citizen at the center. Your voice matters.',
  },
  {
    icon: '🔍',
    title: 'Transparency',
    text: 'Full visibility into every complaint from submission to resolution. No more black boxes.',
  },
  {
    icon: '⚡',
    title: 'Speed & Efficiency',
    text: 'Smart routing ensures complaints reach the right department instantly.',
  },
  {
    icon: '🤝',
    title: 'Accountability',
    text: 'Municipal authorities are held accountable with public timelines and resolution scores.',
  },
];

export default function AboutPage({ onNavigate }) {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-label" style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
              }}>
                🏙️ About CivicLens
              </div>
              <h1 className="about-title">
                Building <span>Smarter</span><br />
                More Responsive Cities
              </h1>
              <p className="about-description">
                CivicLens is a next-generation civic issue management platform built to bridge the gap between citizens and local government. We believe that every pothole, every broken streetlight, and every overflowing bin is a story that deserves to be heard — and resolved.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
                >
                  <MapPin size={18} />
                  Start Reporting
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
                  onClick={() => { onNavigate('dashboard'); window.scrollTo({ top: 0 }); }}
                >
                  View Dashboard
                </button>
              </div>
            </div>

            {/* Stats Visual */}
            <div className="about-visual-card">
              <div className="about-stats-row">
                <div className="about-stat-item">
                  <div className="about-stat-val">1,247</div>
                  <div className="about-stat-lbl">Issues Reported</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-val">71%</div>
                  <div className="about-stat-lbl">Resolution Rate</div>
                </div>
              </div>
              <div className="about-stats-row">
                <div className="about-stat-item">
                  <div className="about-stat-val">4.2</div>
                  <div className="about-stat-lbl">Days Avg. Resolution</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-val">847</div>
                  <div className="about-stat-lbl">Active Citizens</div>
                </div>
              </div>
              <div style={{
                marginTop: 16,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                  🚀 Launched at
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  color: 'var(--teal-lighter)', fontSize: '1.125rem',
                }}>
                  Smart India Hackathon 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-main">
        <div className="container">

          {/* Mission */}
          <div className="mission-card">
            <div className="mission-icon">🎯</div>
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              To empower every citizen to become an active participant in their city's governance. 
              By making civic issue reporting accessible, transparent, and effective, we aim to 
              create cities that are more responsive, cleaner, safer, and built on trust between 
              citizens and their elected representatives.
            </p>
          </div>

          {/* How it Works */}
          <div className="how-it-works">
            <div className="text-center" style={{ marginBottom: 40 }}>
              <span className="section-label">🔄 The Process</span>
              <h2 className="heading-lg">How CivicLens Works</h2>
            </div>
            <div className="steps-grid">
              {[
                {
                  n: 1,
                  title: 'Spot an Issue',
                  text: 'Notice a civic problem in your area? Open CivicLens on your phone or desktop.',
                },
                {
                  n: 2,
                  title: 'Report It',
                  text: 'Fill in the issue category, description, location, and optionally add a photo.',
                },
                {
                  n: 3,
                  title: 'Track Progress',
                  text: 'Receive a unique complaint ID. Monitor its status from Pending to Resolved.',
                },
                {
                  n: 4,
                  title: 'Issue Fixed!',
                  text: 'The municipal team verifies and resolves the issue. Your city improves!',
                },
              ].map((step) => (
                <div key={step.n} className="step-card">
                  <div className="step-number">{step.n}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div style={{ marginBottom: 64 }}>
            <div className="text-center" style={{ marginBottom: 40 }}>
              <span className="section-label">💡 Our Values</span>
              <h2 className="heading-lg">What We Stand For</h2>
            </div>
            <div className="features-grid">
              {values.map((v, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{v.icon}</div>
                  <h3 className="feature-title">{v.title}</h3>
                  <p className="feature-description">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="team-section">
            <div className="text-center">
              <span className="section-label">👥 The Team</span>
              <h2 className="heading-lg" style={{ marginBottom: 8 }}>
                Built by Passionate Builders
              </h2>
              <p className="text-lead" style={{ fontSize: '0.9375rem' }}>
                A passionate team of developers and designers committed to civic technology
              </p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member.name} className="team-card">
                  <div className="team-avatar">{member.emoji}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 64,
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '56px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-50%', right: '-10%',
              width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.03em',
              marginBottom: 12, position: 'relative',
            }}>
              Ready to improve your community?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem',
              marginBottom: 32, position: 'relative',
            }}>
              Report your first civic issue today and be part of the change.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
              style={{ position: 'relative' }}
            >
              <MapPin size={18} />
              Report an Issue Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
