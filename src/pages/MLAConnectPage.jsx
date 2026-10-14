import { useState, useMemo } from 'react';
import { MapPin, Search, Users, CheckCircle, Clock, AlertCircle, ChevronDown, Info, Filter, X } from 'lucide-react';
import {
  STATES, DISTRICTS, CONSTITUENCIES, MLA_DATA,
  sampleComplaints, CATEGORIES,
  NO_ASSEMBLY_UTS, DISTRICT_DATA_UNAVAILABLE,
} from '../data/sampleData';

const STATUS_CONFIG = {
  pending:               { label: 'Pending',              class: 'badge-pending',       dot: '#f59e0b' },
  in_progress:           { label: 'In Progress',          class: 'badge-in_progress',   dot: '#3b82f6' },
  resolved:              { label: 'Resolved',             class: 'badge-resolved',      dot: '#10b981' },
  rejected:              { label: 'Rejected',             class: 'badge-rejected',      dot: '#ef4444' },
  awaiting_confirmation: { label: 'Awaiting Confirm.',    class: 'badge-awaiting',      dot: '#7c3aed' },
  citizen_verified:      { label: 'Citizen Verified',     class: 'badge-citizen',       dot: '#0d9488' },
};

const CAT_COLORS = {
  pothole:     { bg: '#fff7ed', border: '#fed7aa', icon: '#f97316' },
  garbage:     { bg: '#f0fdf4', border: '#bbf7d0', icon: '#22c55e' },
  water:       { bg: '#eff6ff', border: '#bfdbfe', icon: '#3b82f6' },
  road:        { bg: '#faf5ff', border: '#e9d5ff', icon: '#a855f7' },
  streetlight: { bg: '#fefce8', border: '#fef08a', icon: '#eab308' },
  other:       { bg: '#f9fafb', border: '#e5e7eb', icon: '#6b7280' },
};

export default function MLAConnectPage({ onNavigate }) {
  const [selectedState, setSelectedState]             = useState('');
  const [selectedDistrict, setSelectedDistrict]       = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [catFilter, setCatFilter]                     = useState('all');
  const [statusFilter, setStatusFilter]               = useState('all');
  const [search, setSearch]                           = useState('');

  const isNoAssemblyUT      = selectedState ? NO_ASSEMBLY_UTS.has(selectedState) : false;
  const isDistrictUnavail   = selectedState ? DISTRICT_DATA_UNAVAILABLE.has(selectedState) : false;
  const districts            = selectedState && !isNoAssemblyUT && !isDistrictUnavail
                                 ? (DISTRICTS[selectedState] || []) : [];
  const isConstUnavail       = selectedDistrict
                                 ? !(selectedDistrict in CONSTITUENCIES)
                                 : false;
  const constituencies       = selectedDistrict && !isConstUnavail
                                 ? (CONSTITUENCIES[selectedDistrict] || []) : [];
  const mlaInfo              = selectedConstituency ? MLA_DATA[selectedConstituency] : null;


  // Filter complaints for selected constituency
  const constituencyComplaints = useMemo(() => {
    if (!selectedConstituency) return [];
    return sampleComplaints.filter(c => c.constituency === selectedConstituency);
  }, [selectedConstituency]);

  // Stats derived from actual complaint records
  const stats = useMemo(() => {
    const total    = constituencyComplaints.length;
    const resolved = constituencyComplaints.filter(c => ['resolved', 'citizen_verified'].includes(c.status)).length;
    const pending  = constituencyComplaints.filter(c => c.status === 'pending').length;
    const inProg   = constituencyComplaints.filter(c => c.status === 'in_progress').length;
    const verified = constituencyComplaints.filter(c => c.status === 'citizen_verified').length;
    return { total, resolved, pending, inProg, verified };
  }, [constituencyComplaints]);

  // Apply additional filters on top of constituency
  const filteredComplaints = useMemo(() => {
    return constituencyComplaints.filter(c => {
      const matchCat    = catFilter    === 'all' || c.category === catFilter;
      const matchStatus = statusFilter === 'all' || c.status   === statusFilter;
      const matchSearch = !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });
  }, [constituencyComplaints, catFilter, statusFilter, search]);

  const handleStateChange = (val) => {
    setSelectedState(val);
    setSelectedDistrict('');
    setSelectedConstituency('');
    setCatFilter('all');
    setStatusFilter('all');
    setSearch('');
  };

  const handleDistrictChange = (val) => {
    setSelectedDistrict(val);
    setSelectedConstituency('');
  };

  const getCat = (id) => CATEGORIES.find(c => c.id === id);

  return (
    <div className="mla-connect-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header-section">
          <span className="section-label">🏛️ Constituency Connect</span>
          <h1 className="heading-lg" style={{ marginBottom: 8 }}>MLA Connect</h1>
          <p className="text-lead" style={{ fontSize: '0.9375rem', maxWidth: 600 }}>
            Select your constituency to view civic issue statistics, browse reported problems, and find your representative's information.
          </p>
        </div>

        {/* Constituency Selector */}
        <div className="mla-selector-card">
          <div className="mla-selector-header">
            <MapPin size={18} style={{ color: 'var(--teal)' }} />
            <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9375rem' }}>
              Select Your Constituency
            </span>
          </div>
          <div className="mla-selector-grid">
            {/* State dropdown — always shown */}
            <SelectBox
              label="State / Union Territory"
              value={selectedState}
              onChange={handleStateChange}
              placeholder="Choose State / UT"
              options={STATES}
            />

            {/* District dropdown — conditionally shown or replaced by notice */}
            {isNoAssemblyUT ? (
              <div className="select-box">
                <label className="form-label">District</label>
                <div className="mla-notice mla-notice-info">
                  🏛️ This Union Territory does not have a Legislative Assembly.
                  MLA / MLC constituency selection is not applicable here.
                </div>
              </div>
            ) : isDistrictUnavail ? (
              <div className="select-box">
                <label className="form-label">District</label>
                <div className="mla-notice mla-notice-warn">
                  ⚠️ District data not yet available for this state in the CivicLens demo.
                </div>
              </div>
            ) : (
              <SelectBox
                label="District"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                placeholder={selectedState ? 'Choose District' : 'Select state first'}
                options={districts}
                disabled={!selectedState}
              />
            )}

            {/* Constituency dropdown — conditionally shown or replaced by notice */}
            {isNoAssemblyUT || isDistrictUnavail ? (
              <div className="select-box">
                <label className="form-label">Assembly Constituency</label>
                <div className="mla-notice mla-notice-gray">
                  — Not applicable
                </div>
              </div>
            ) : isConstUnavail ? (
              <div className="select-box">
                <label className="form-label">Assembly Constituency</label>
                <div className="mla-notice mla-notice-warn">
                  ⚠️ Constituency data not yet available for this district in the demo.
                </div>
              </div>
            ) : (
              <SelectBox
                label="Assembly Constituency"
                value={selectedConstituency}
                onChange={setSelectedConstituency}
                placeholder={selectedDistrict ? 'Choose Constituency' : 'Select district first'}
                options={constituencies}
                disabled={!selectedDistrict}
              />
            )}
          </div>
        </div>

        {/* No Selection Prompt */}
        {!selectedConstituency && !isNoAssemblyUT && !isDistrictUnavail && !isConstUnavail && (
          <div className="mla-empty-prompt">
            <div className="mla-empty-icon">🗺️</div>
            <p className="mla-empty-title">Choose your constituency above</p>
            <p className="mla-empty-sub">
              Select a state, district, and assembly constituency to view civic issue statistics and your representative's details.
            </p>
          </div>
        )}

        {/* Prompt for UTs without assembly */}
        {isNoAssemblyUT && (
          <div className="mla-empty-prompt" style={{ borderColor: '#bfdbfe' }}>
            <div className="mla-empty-icon">🏛️</div>
            <p className="mla-empty-title">No Legislative Assembly</p>
            <p className="mla-empty-sub">
              This Union Territory does not have its own Legislative Assembly under the Constitution of India.
              MLA/constituency-based civic tracking is not applicable here.
              You can still <span
                style={{ color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
              >report a civic issue</span> for your area.
            </p>
          </div>
        )}

        {/* Prompt for states/districts with unavailable data */}
        {(isDistrictUnavail || isConstUnavail) && !isNoAssemblyUT && (
          <div className="mla-empty-prompt" style={{ borderColor: '#fde68a' }}>
            <div className="mla-empty-icon">⚠️</div>
            <p className="mla-empty-title">Data Not Yet Available</p>
            <p className="mla-empty-sub">
              District and constituency data for this selection has not been added to the CivicLens demo yet.
              We are working to expand coverage to all states and districts.
            </p>
          </div>
        )}


        {/* Content: shown after constituency is selected */}
        {selectedConstituency && (
          <>
            {/* Stats Row */}
            <div className="mla-stats-grid">
              <StatCard
                icon="📋" label="Total Complaints"
                value={stats.total} color="var(--navy)"
                note={`in ${constituencies.find(c => c.id === selectedConstituency)?.label || selectedConstituency}`}
              />
              <StatCard icon="⏳" label="Pending" value={stats.pending} color="#f59e0b" />
              <StatCard icon="🔧" label="In Progress" value={stats.inProg} color="#3b82f6" />
              <StatCard icon="✅" label="Resolved" value={stats.resolved} color="#10b981" />
              <StatCard icon="🏅" label="Citizen-Verified" value={stats.verified} color="var(--teal)" />
            </div>

            {/* Resolution progress bar */}
            {stats.total > 0 && (
              <div className="mla-resolution-bar-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy)' }}>
                    Resolution Rate
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--teal)' }}>
                    {Math.round((stats.resolved / stats.total) * 100)}%
                    <span style={{ fontWeight: 400, color: 'var(--gray-400)', marginLeft: 6 }}>
                      ({stats.resolved}/{stats.total} complaints)
                    </span>
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 6 }}>
                  Based on {stats.total} complaint(s) recorded on CivicLens for this constituency (DEMO DATA)
                </p>
              </div>
            )}

            {/* Two-column: MLA info + Issue List */}
            <div className="mla-content-grid">
              {/* MLA Info Panel */}
              <div>
                <div className="mla-info-card">
                  {/* Demo Warning */}
                  <div className="demo-banner">
                    <Info size={14} />
                    <span>
                      <strong>DEMO DATA</strong> — Representative details below are sample placeholders.
                      CivicLens does not imply any official affiliation or endorsement.
                    </span>
                  </div>

                  <div className="mla-avatar">
                    <span style={{ fontSize: '2rem' }}>👤</span>
                  </div>
                  {mlaInfo ? (
                    <>
                      <h3 className="mla-name">{mlaInfo.name}</h3>
                      <p className="mla-constituency">{mlaInfo.constituency}</p>
                      <span className="mla-since-badge">Serving since {mlaInfo.since}</span>

                      <div className="mla-detail-list">
                        <MlaDetailRow icon="🏛️" label="Party" value={mlaInfo.party} />
                        <MlaDetailRow icon="📍" label="Office" value={mlaInfo.officeAddress} />
                        <MlaDetailRow icon="📞" label="Phone" value={mlaInfo.phone} />
                        <MlaDetailRow icon="✉️" label="Email" value={mlaInfo.email} />
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        Representative details not available for this constituency in the demo.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 12 }}
                  onClick={() => { onNavigate('report'); window.scrollTo({ top: 0 }); }}
                >
                  <MapPin size={16} />
                  Report Issue in This Constituency
                </button>
              </div>

              {/* Issue Browsing Panel */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1.0625rem' }}>
                    Issues in This Constituency
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                    {filteredComplaints.length} shown
                  </span>
                </div>

                {/* Filters */}
                <div className="mla-filters">
                  <div className="search-bar" style={{ flex: 1 }}>
                    <Search size={15} className="search-icon" />
                    <input
                      className="form-input"
                      placeholder="Search issues..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="form-select"
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                    style={{ minWidth: 140 }}
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ minWidth: 140 }}
                  >
                    <option value="all">All Statuses</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Issue Cards */}
                {filteredComplaints.length === 0 ? (
                  <div className="empty-state" style={{ padding: '40px 20px' }}>
                    <div className="empty-state-icon">🔍</div>
                    <p className="empty-state-title">No issues found</p>
                    <p style={{ fontSize: '0.875rem' }}>
                      {constituencyComplaints.length === 0
                        ? 'No complaints have been recorded for this constituency in the demo.'
                        : 'Try adjusting your filters.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredComplaints.map(complaint => {
                      const cat = getCat(complaint.category);
                      const catStyle = CAT_COLORS[complaint.category] || CAT_COLORS.other;
                      const statusCfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.pending;
                      return (
                        <div key={complaint.id} className="mla-issue-row">
                          <div
                            className="mla-issue-icon"
                            style={{ background: catStyle.bg, border: `1px solid ${catStyle.border}` }}
                          >
                            {cat?.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="mla-issue-title">{complaint.title}</p>
                            <p className="mla-issue-meta">
                              <MapPin size={11} /> {complaint.location}
                              <span className="mla-dot">·</span>
                              {complaint.ward}
                              <span className="mla-dot">·</span>
                              {new Date(complaint.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span className={`badge ${statusCfg.class}`}>{statusCfg.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SelectBox({ label, value, onChange, placeholder, options, disabled }) {
  return (
    <div className="select-box">
      <label className="form-label">{label}</label>
      <div className="select-wrapper">
        <select
          className="form-select"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="select-chevron" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, note }) {
  return (
    <div className="mla-stat-card">
      <div className="mla-stat-icon">{icon}</div>
      <div className="mla-stat-value" style={{ color }}>{value}</div>
      <div className="mla-stat-label">{label}</div>
      {note && <div className="mla-stat-note">{note}</div>}
    </div>
  );
}

function MlaDetailRow({ icon, label, value }) {
  return (
    <div className="mla-detail-row">
      <span className="mla-detail-icon">{icon}</span>
      <div>
        <p className="mla-detail-label">{label}</p>
        <p className="mla-detail-value">{value}</p>
      </div>
    </div>
  );
}
