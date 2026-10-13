import { useState } from 'react';
import { TrendingUp, TrendingDown, CheckCircle, Clock, AlertCircle, BarChart2, Activity, Users, RefreshCw } from 'lucide-react';
import { adminStats, categoryStats, recentActivity, CATEGORIES } from '../data/sampleData';

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Complaints',
    value: adminStats.totalComplaints.toLocaleString(),
    icon: <BarChart2 size={20} />,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    change: '+12.4%',
    changeDir: 'up',
    changeNote: 'vs last month',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    value: adminStats.resolved.toLocaleString(),
    icon: <CheckCircle size={20} />,
    iconBg: '#ecfdf5',
    iconColor: '#10b981',
    change: '+8.2%',
    changeDir: 'up',
    changeNote: 'resolution rate',
  },
  {
    key: 'progress',
    label: 'In Progress',
    value: adminStats.inProgress.toLocaleString(),
    icon: <Clock size={20} />,
    iconBg: '#eff6ff',
    iconColor: '#6366f1',
    change: '−3.1%',
    changeDir: 'down',
    changeNote: 'from last week',
  },
  {
    key: 'pending',
    label: 'Pending',
    value: adminStats.pending.toLocaleString(),
    icon: <AlertCircle size={20} />,
    iconBg: '#fffbeb',
    iconColor: '#f59e0b',
    change: '−5.7%',
    changeDir: 'down',
    changeNote: 'from last week',
  },
];

// Simple SVG donut chart
function DonutChart({ percentage, size = 120, strokeWidth = 14 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#tealGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <defs>
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '1.25rem',
          fontWeight: 800, color: 'var(--navy)', lineHeight: 1,
        }}>
          {percentage}%
        </span>
        <span style={{ fontSize: '0.6rem', color: 'var(--gray-400)', marginTop: 2 }}>
          Resolved
        </span>
      </div>
    </div>
  );
}

// Mini bar chart using SVG
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.count));
  const chartH = 80;
  const barW = 24;
  const gap = 8;
  const totalW = data.length * (barW + gap);

  return (
    <svg width={totalW} height={chartH + 20} style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.count / max) * chartH);
        const x = i * (barW + gap);
        const y = chartH - barH;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx={4} fill={d.color} opacity={0.8}
            />
            <text
              x={x + barW / 2} y={chartH + 14}
              textAnchor="middle"
              fontSize={9} fill="#94a3b8" fontWeight={500}
            >
              {d.category.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function AdminPage({ onNavigate }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const getCat = (id) => CATEGORIES.find(c => c.id === id);

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <p className="admin-greeting">Good evening, Admin 👋</p>
            <h1 className="heading-lg" style={{ marginBottom: 4 }}>Analytics Overview</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
              Last updated: {new Date().toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              className="btn btn-outline"
              onClick={handleRefresh}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <RefreshCw
                size={15}
                style={{
                  animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
                }}
              />
              Refresh
            </button>
            <button
              className="btn btn-primary"
              onClick={() => { onNavigate('dashboard'); window.scrollTo({ top: 0 }); }}
            >
              View All Complaints
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {STAT_CARDS.map((card) => (
            <div key={card.key} className={`stat-card ${card.key}`}>
              <div
                className="stat-icon"
                style={{ background: card.iconBg, color: card.iconColor }}
              >
                {card.icon}
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              <div className={`stat-change ${card.changeDir}`}>
                {card.changeDir === 'up'
                  ? <TrendingUp size={13} />
                  : <TrendingDown size={13} />
                }
                <span>{card.change}</span>
                <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>
                  {card.changeNote}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="admin-grid">
          {/* Category Breakdown */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Issues by Category</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                All time
              </span>
            </div>
            <div className="admin-card-body">
              <div className="category-bars">
                {categoryStats.map((cat) => {
                  const pct = Math.round((cat.count / adminStats.totalComplaints) * 100);
                  return (
                    <div key={cat.category} className="category-bar-item">
                      <div className="category-bar-header">
                        <span className="category-bar-label">
                          <span
                            className="category-bar-dot"
                            style={{ background: cat.color }}
                          />
                          {cat.category}
                        </span>
                        <span className="category-bar-count">{cat.count}</span>
                      </div>
                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Resolution Overview</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                Current month
              </span>
            </div>
            <div className="admin-card-body">
              <div className="resolution-display">
                <DonutChart percentage={adminStats.resolutionRate} />
                <div className="resolution-stats">
                  <div className="res-stat">
                    <div className="res-stat-left">
                      <span className="res-dot" style={{ background: '#10b981' }} />
                      Resolved
                    </div>
                    <span className="res-stat-right">{adminStats.resolved}</span>
                  </div>
                  <div className="res-stat">
                    <div className="res-stat-left">
                      <span className="res-dot" style={{ background: '#6366f1' }} />
                      In Progress
                    </div>
                    <span className="res-stat-right">{adminStats.inProgress}</span>
                  </div>
                  <div className="res-stat">
                    <div className="res-stat-left">
                      <span className="res-dot" style={{ background: '#f59e0b' }} />
                      Pending
                    </div>
                    <span className="res-stat-right">{adminStats.pending}</span>
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, var(--teal-pale), rgba(15,32,66,0.03))',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(13,148,136,0.15)',
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: 2 }}>
                      Avg. Resolution Time
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.25rem',
                      fontWeight: 800, color: 'var(--teal)',
                    }}>
                      {adminStats.avgResolutionDays} days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="admin-grid">
          {/* Recent Activity */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Recent Activity</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { onNavigate('dashboard'); window.scrollTo({ top: 0 }); }}
              >
                View all →
              </button>
            </div>
            <div className="admin-card-body" style={{ padding: '4px 24px 20px' }}>
              <div className="activity-list">
                {recentActivity.map((item, i) => {
                  const cat = getCat(item.category);
                  return (
                    <div key={i} className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ background: 'var(--teal-pale)', fontSize: '1rem' }}
                      >
                        {cat?.icon}
                      </div>
                      <div className="activity-content">
                        <div className="activity-id">{item.id}</div>
                        <div className="activity-action">{item.action}</div>
                      </div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Performance Metrics</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Oct 2024</span>
            </div>
            <div className="admin-card-body">
              {/* Bar chart */}
              <div style={{ marginBottom: 24, overflowX: 'auto' }}>
                <MiniBarChart data={categoryStats.map(c => ({ ...c, count: c.count }))} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <MetricRow
                  label="This Month"
                  value={adminStats.thisMonth}
                  total={adminStats.lastMonth + adminStats.thisMonth}
                  color="#0d9488"
                />
                <MetricRow
                  label="Last Month"
                  value={adminStats.lastMonth}
                  total={adminStats.lastMonth + adminStats.thisMonth}
                  color="#94a3b8"
                />
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4,
                }}>
                  <MiniStat label="Avg Daily" value="2.9" unit="reports" />
                  <MiniStat label="Citizens Engaged" value="847" unit="this month" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function MetricRow({ label, value, total, color }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: 6, fontSize: '0.8125rem',
      }}>
        <span style={{ color: 'var(--gray-600)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{value} reports</span>
      </div>
      <div style={{
        height: 8, background: 'var(--gray-100)',
        borderRadius: 'var(--radius-full)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: 'var(--radius-full)',
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit }) {
  return (
    <div style={{
      background: 'var(--gray-50)', borderRadius: 'var(--radius-md)',
      padding: '14px 16px', border: '1px solid var(--gray-100)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '1.5rem',
        fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.04em',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500, marginTop: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--gray-300)' }}>{unit}</div>
    </div>
  );
}
