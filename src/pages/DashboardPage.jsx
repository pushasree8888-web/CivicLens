import { useState } from 'react';
import { Search, ThumbsUp, MapPin, Calendar, Filter, X } from 'lucide-react';
import { sampleComplaints, CATEGORIES } from '../data/sampleData';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Issues' },
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'rejected', label: 'Rejected' },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'badge-pending', dot: '#f59e0b' },
  in_progress: { label: 'In Progress', class: 'badge-in_progress', dot: '#3b82f6' },
  resolved: { label: 'Resolved', class: 'badge-resolved', dot: '#10b981' },
  rejected: { label: 'Rejected', class: 'badge-rejected', dot: '#ef4444' },
};

const CAT_COLORS = {
  pothole: { bg: '#fff7ed', border: '#fed7aa', icon: '#f97316' },
  garbage: { bg: '#f0fdf4', border: '#bbf7d0', icon: '#22c55e' },
  water: { bg: '#eff6ff', border: '#bfdbfe', icon: '#3b82f6' },
  road: { bg: '#faf5ff', border: '#e9d5ff', icon: '#a855f7' },
  streetlight: { bg: '#fefce8', border: '#fef08a', icon: '#eab308' },
  other: { bg: '#f9fafb', border: '#e5e7eb', icon: '#6b7280' },
};

export default function DashboardPage({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [upvoted, setUpvoted] = useState(new Set());
  const [selected, setSelected] = useState(null);

  const filtered = sampleComplaints.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchCat = catFilter === 'all' || c.category === catFilter;
    const matchSearch = !search || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const getCat = (id) => CATEGORIES.find(c => c.id === id);

  const handleUpvote = (e, id) => {
    e.stopPropagation();
    setUpvoted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="heading-lg" style={{ marginBottom: 6 }}>Complaints Dashboard</h1>
            <p className="text-lead" style={{ fontSize: '0.9375rem' }}>
              Browse and track all reported civic issues in your community
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
          >
            <MapPin size={16} />
            Report New Issue
          </button>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          {/* Search */}
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              className="form-input"
              placeholder="Search issues, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                className={`filter-chip${statusFilter === f.id ? ' active' : ''}`}
                onClick={() => setStatusFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          <button
            className={`filter-chip${catFilter === 'all' ? ' active' : ''}`}
            onClick={() => setCatFilter('all')}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip${catFilter === cat.id ? ' active' : ''}`}
              onClick={() => setCatFilter(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>
            Showing <strong style={{ color: 'var(--navy)' }}>{filtered.length}</strong> complaint{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
          </p>
          {(search || statusFilter !== 'all' || catFilter !== 'all') && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => { setSearch(''); setStatusFilter('all'); setCatFilter('all'); }}
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {/* Complaints Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No complaints found</p>
            <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="complaints-grid">
            {filtered.map((complaint) => {
              const cat = getCat(complaint.category);
              const catStyle = CAT_COLORS[complaint.category] || CAT_COLORS.other;
              const statusCfg = STATUS_CONFIG[complaint.status];
              const voted = upvoted.has(complaint.id);

              return (
                <div
                  key={complaint.id}
                  className="complaint-card"
                  onClick={() => setSelected(complaint)}
                >
                  <div className="complaint-card-top">
                    <div className="complaint-card-header">
                      <div
                        className="complaint-cat-icon"
                        style={{ background: catStyle.bg, border: `1px solid ${catStyle.border}` }}
                      >
                        {cat?.icon}
                      </div>
                      <h3 className="complaint-title">{complaint.title}</h3>
                      <span className={`badge ${statusCfg.class}`} style={{ flexShrink: 0 }}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="complaint-description">{complaint.description}</p>
                  </div>
                  <div className="complaint-card-bottom">
                    <div className="complaint-meta">
                      <MapPin size={12} />
                      <span>{complaint.location}</span>
                    </div>
                    <div className="complaint-meta" style={{ marginBottom: 12 }}>
                      <Calendar size={12} />
                      <span>{formatDate(complaint.date)}</span>
                      <span style={{ margin: '0 4px', color: 'var(--gray-200)' }}>·</span>
                      <span>by {complaint.reportedBy}</span>
                      <span style={{ margin: '0 4px', color: 'var(--gray-200)' }}>·</span>
                      <span>{complaint.ward}</span>
                    </div>
                    <div className="complaint-footer">
                      <button
                        className="upvote-btn"
                        onClick={(e) => handleUpvote(e, complaint.id)}
                        style={voted ? {
                          background: 'var(--teal-pale)',
                          borderColor: 'var(--teal)',
                          color: 'var(--teal)',
                        } : {}}
                      >
                        <ThumbsUp size={13} fill={voted ? 'currentColor' : 'none'} />
                        {complaint.upvotes + (voted ? 1 : 0)}
                      </button>
                      <span className="complaint-id">{complaint.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <ComplaintModal
          complaint={selected}
          onClose={() => setSelected(null)}
          getCat={getCat}
          catColors={CAT_COLORS}
        />
      )}
    </div>
  );
}

function ComplaintModal({ complaint, onClose, getCat, catColors }) {
  const cat = getCat(complaint.category);
  const catStyle = catColors[complaint.category] || catColors.other;
  const statusCfg = {
    pending: { label: 'Pending', class: 'badge-pending' },
    in_progress: { label: 'In Progress', class: 'badge-in_progress' },
    resolved: { label: 'Resolved', class: 'badge-resolved' },
    rejected: { label: 'Rejected', class: 'badge-rejected' },
  }[complaint.status];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-2xl)',
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--gray-100)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 'var(--radius-lg)',
              background: catStyle.bg, border: `1px solid ${catStyle.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.375rem', flexShrink: 0,
            }}
          >
            {cat?.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className={`badge ${statusCfg.class}`}>{statusCfg.label}</span>
              <span style={{
                padding: '2px 10px',
                background: catStyle.bg,
                border: `1px solid ${catStyle.border}`,
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: catStyle.icon,
              }}>
                {cat?.label}
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700,
              color: 'var(--navy)', letterSpacing: '-0.02em',
            }}>
              {complaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--gray-100)', color: 'var(--gray-500)',
              border: 'none', cursor: 'pointer', flexShrink: 0,
              transition: 'all var(--transition-fast)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          <p style={{
            fontSize: '0.9375rem', color: 'var(--gray-600)',
            lineHeight: 1.7, marginBottom: 24,
          }}>
            {complaint.description}
          </p>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <DetailItem icon={<MapPin size={15} />} label="Location" value={complaint.location} />
            <DetailItem icon={<Calendar size={15} />} label="Reported On" value={formatDate(complaint.date)} />
            <DetailItem icon={'👤'} label="Reported By" value={complaint.reportedBy} />
            <DetailItem icon={'🏛️'} label="Ward" value={complaint.ward} />
            <DetailItem icon={'🔖'} label="Complaint ID" value={complaint.id} mono />
            <DetailItem icon={<ThumbsUp size={15} />} label="Upvotes" value={complaint.upvotes} />
          </div>

          {/* Timeline */}
          <div style={{
            background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
          }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
              Status Timeline
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <TimelineItem label="Submitted" date={complaint.date} done />
              <TimelineItem label="Under Review" date={complaint.status !== 'pending' ? 'Oct 12, 2024' : null} done={complaint.status !== 'pending'} />
              <TimelineItem label="In Progress" date={['in_progress', 'resolved'].includes(complaint.status) ? 'Oct 13, 2024' : null} done={['in_progress', 'resolved'].includes(complaint.status)} />
              <TimelineItem label="Resolved" date={complaint.status === 'resolved' ? 'Oct 15, 2024' : null} done={complaint.status === 'resolved'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, mono }) {
  return (
    <div style={{
      background: 'var(--gray-50)', borderRadius: 'var(--radius-md)',
      padding: '12px 14px', border: '1px solid var(--gray-100)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600,
        marginBottom: 4,
      }}>
        {typeof icon === 'string' ? icon : icon}
        {label}
      </div>
      <p style={{
        fontSize: '0.8375rem', color: 'var(--gray-700)', fontWeight: 500,
        fontFamily: mono ? 'Courier New, monospace' : 'inherit',
      }}>
        {value}
      </p>
    </div>
  );
}

function TimelineItem({ label, date, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--success)' : 'var(--gray-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.625rem', color: 'white', fontWeight: 700,
      }}>
        {done ? '✓' : ''}
      </div>
      <span style={{
        fontSize: '0.8125rem',
        fontWeight: done ? 600 : 400,
        color: done ? 'var(--gray-700)' : 'var(--gray-300)',
        flex: 1,
      }}>
        {label}
      </span>
      {date && (
        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
          {formatDate(date)}
        </span>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}
