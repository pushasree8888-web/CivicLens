import { useState, useMemo } from 'react';
import { TrendingUp, Award, AlertCircle, ChevronUp, ChevronDown, Info, BarChart2 } from 'lucide-react';
import { constituencyRankings } from '../data/sampleData';

const SORT_OPTIONS = [
  { id: 'resolutionPct', label: 'Resolution %' },
  { id: 'citizenVerified', label: 'Citizen-Verified' },
  { id: 'pending', label: 'Pending (Lowest first)' },
  { id: 'total', label: 'Total Complaints' },
];

const STATE_OPTIONS = ['All States', 'Rajasthan', 'Maharashtra', 'Karnataka'];

const MEDAL = ['🥇', '🥈', '🥉'];

function getRatingColor(pct) {
  if (pct >= 65) return { color: '#10b981', bg: '#ecfdf5', label: 'Good' };
  if (pct >= 45) return { color: '#f59e0b', bg: '#fffbeb', label: 'Moderate' };
  return { color: '#ef4444', bg: '#fef2f2', label: 'Needs Attention' };
}

export default function RankingsPage() {
  const [sortBy, setSortBy]        = useState('resolutionPct');
  const [stateFilter, setStateFilter] = useState('All States');
  const [sortDir, setSortDir]      = useState('desc'); // desc = highest first (except 'pending')

  const sorted = useMemo(() => {
    let data = [...constituencyRankings];
    if (stateFilter !== 'All States') {
      data = data.filter(c => c.state === stateFilter);
    }
    data.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      // For 'pending', ascending is "better" (fewer pending = better), so flip:
      if (sortBy === 'pending') return sortDir === 'desc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return data;
  }, [sortBy, stateFilter, sortDir]);

  const toggleDir = () => setSortDir(d => d === 'desc' ? 'asc' : 'desc');

  const handleSort = (id) => {
    if (sortBy === id) {
      toggleDir();
    } else {
      setSortBy(id);
      setSortDir('desc');
    }
  };

  return (
    <div className="rankings-page">
      <div className="container">
        {/* Header */}
        <div className="page-header-section">
          <span className="section-label">📊 Civic Accountability</span>
          <h1 className="heading-lg" style={{ marginBottom: 8 }}>Constituency Rankings</h1>
          <p className="text-lead" style={{ fontSize: '0.9375rem', maxWidth: 640 }}>
            A transparent comparison of civic issue resolution across constituencies, based on complaint records available on CivicLens.
          </p>
        </div>

        {/* DEMO Disclaimer */}
        <div className="rankings-disclaimer">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Info size={18} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, color: '#7c3aed', marginBottom: 4, fontSize: '0.875rem' }}>
                DEMO DATA — Important Disclaimer
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6d28d9', lineHeight: 1.6 }}>
                All rankings shown below are based on <strong>sample/simulated data</strong> for demonstration purposes only.
                These numbers do <strong>not</strong> represent actual government performance, MLA effectiveness, or official civic records.
                Constituencies with fewer complaints may show inflated or misleading percentages — always consider sample size.
                Do not draw real-world conclusions from this data.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rankings-controls">
          <div>
            <label className="form-label" style={{ marginBottom: 6 }}>Filter by State</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STATE_OPTIONS.map(s => (
                <button
                  key={s}
                  className={`filter-chip${stateFilter === s ? ' active' : ''}`}
                  onClick={() => setStateFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: 6 }}>Sort By</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`filter-chip${sortBy === opt.id ? ' active' : ''}`}
                  onClick={() => handleSort(opt.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {opt.label}
                  {sortBy === opt.id && (
                    sortDir === 'desc'
                      ? <ChevronDown size={13} />
                      : <ChevronUp size={13} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Legend */}
        <div className="rankings-legend">
          <div className="legend-item"><span style={{ color: '#10b981', fontWeight: 700 }}>●</span> Good (≥65%)</div>
          <div className="legend-item"><span style={{ color: '#f59e0b', fontWeight: 700 }}>●</span> Moderate (45–64%)</div>
          <div className="legend-item"><span style={{ color: '#ef4444', fontWeight: 700 }}>●</span> Needs Attention (&lt;45%)</div>
          <div className="legend-item" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            Resolution % = Resolved ÷ Total Complaints
          </div>
        </div>

        {/* Empty state */}
        {sorted.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p className="empty-state-title">No constituencies found</p>
            <p style={{ fontSize: '0.875rem' }}>Try selecting a different state filter.</p>
          </div>
        )}

        {/* Rankings Table / Cards */}
        <div className="rankings-list">
          {sorted.map((c, idx) => {
            const rating = getRatingColor(c.resolutionPct);
            const rank = idx + 1;
            return (
              <div key={c.id} className="rank-card">
                {/* Rank badge */}
                <div className="rank-number">
                  {rank <= 3 ? (
                    <span style={{ fontSize: '1.375rem' }}>{MEDAL[rank - 1]}</span>
                  ) : (
                    <span className="rank-num-text">#{rank}</span>
                  )}
                </div>

                {/* Main info */}
                <div className="rank-main">
                  <div className="rank-top-row">
                    <div>
                      <h3 className="rank-name">{c.name}</h3>
                      <p className="rank-location">{c.district}, {c.state}</p>
                    </div>
                    <div className="rank-pct-badge" style={{ background: rating.bg, color: rating.color }}>
                      <span className="rank-pct-value">{c.resolutionPct.toFixed(1)}%</span>
                      <span className="rank-pct-label">{rating.label}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${c.resolutionPct}%`, background: rating.color }}
                      />
                    </div>
                  </div>

                  {/* Metric grid */}
                  <div className="rank-metrics">
                    <MetricChip icon="📋" label="Total" value={c.total} />
                    <MetricChip icon="✅" label="Resolved" value={c.resolved} color="#10b981" />
                    <MetricChip icon="⏳" label="Pending" value={c.pending} color="#f59e0b" />
                    <MetricChip icon="🔧" label="In Progress" value={c.inProgress} color="#3b82f6" />
                    <MetricChip icon="🏅" label="Citizen-Verified" value={c.citizenVerified} color="var(--teal)" />
                  </div>

                  {/* Sample size note */}
                  <p className="rank-sample-note">
                    Based on {c.total} complaint{c.total !== 1 ? 's' : ''} on CivicLens
                    {c.total < 100 && (
                      <> · <span style={{ color: '#f59e0b' }}>⚠️ Small sample — percentage may not be representative</span></>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="rankings-footer-note">
          <BarChart2 size={16} style={{ color: 'var(--gray-400)' }} />
          <p>
            CivicLens rankings are computed from complaint records submitted through this platform only.
            They do not reflect official government statistics, audit reports, or municipal data.
            Low complaint counts can cause misleading resolution percentages — always check the sample size.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricChip({ icon, label, value, color }) {
  return (
    <div className="metric-chip">
      <span className="metric-chip-icon">{icon}</span>
      <span className="metric-chip-value" style={{ color: color || 'var(--navy)' }}>{value}</span>
      <span className="metric-chip-label">{label}</span>
    </div>
  );
}
