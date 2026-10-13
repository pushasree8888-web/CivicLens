import { useState } from 'react';
import { MapPin, Upload, CheckCircle, X, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/sampleData';

function generateId() {
  return 'CL-2024-' + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
}

export default function ReportPage({ onNavigate }) {
  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    ward: '',
    name: '',
    phone: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [dragover, setDragover] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.category) e.category = 'Please select an issue category';
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length < 10) e.title = 'Title must be at least 10 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 30) e.description = 'Please provide more details (at least 30 characters)';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.name.trim()) e.name = 'Name is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const id = generateId();
      setComplaintId(id);
      setSubmitted(true);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      handleChange('photo', file);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container page-header-content">
          <div className="breadcrumb">
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => { onNavigate('home'); window.scrollTo({ top: 0 }); }}
            >
              Home
            </span>
            <span>›</span>
            <span className="active">Report Issue</span>
          </div>
          <h1 className="page-title">Report a Civic Issue</h1>
          <p className="page-subtitle">
            Fill in the details below to submit your complaint. Our team ensures every issue is reviewed and assigned promptly.
          </p>
        </div>
      </div>

      {/* Form Body */}
      <div className="report-page">
        <div className="container">
          <div className="report-form-container">
            {/* Form Tips */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff, #f0fdfa)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 24,
            }}>
              <AlertCircle size={18} style={{ color: 'var(--info)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>
                  Tips for a faster resolution
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                  Be specific in your title, provide a detailed description, and include the exact location. Adding a photo significantly speeds up verification.
                </p>
              </div>
            </div>

            <div className="report-form-card">
              <div className="form-section-header">
                <h2 className="form-section-title">Complaint Details</h2>
                <p className="form-section-subtitle">Fields marked with * are required</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="report-form-body">

                  {/* Category Selection */}
                  <div className="form-group">
                    <label className="form-label">
                      Issue Category <span>*</span>
                    </label>
                    <div className="category-grid">
                      {CATEGORIES.map((cat) => (
                        <div className="category-option" key={cat.id}>
                          <input
                            type="radio"
                            id={`cat-${cat.id}`}
                            name="category"
                            value={cat.id}
                            checked={form.category === cat.id}
                            onChange={() => handleChange('category', cat.id)}
                          />
                          <label className="category-label" htmlFor={`cat-${cat.id}`}>
                            <span className="category-label-icon">{cat.icon}</span>
                            <span className="category-label-text">{cat.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.category && <FieldError message={errors.category} />}
                  </div>

                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="issue-title">
                      Issue Title <span>*</span>
                    </label>
                    <input
                      id="issue-title"
                      className={`form-input${errors.title ? ' error' : ''}`}
                      style={errors.title ? { borderColor: 'var(--error)' } : {}}
                      placeholder="e.g. Large pothole on MG Road near bus stop"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                    {errors.title && <FieldError message={errors.title} />}
                    <span className="form-hint">{form.title.length}/100 characters</span>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="issue-desc">
                      Description <span>*</span>
                    </label>
                    <textarea
                      id="issue-desc"
                      className={`form-input form-textarea${errors.description ? ' error' : ''}`}
                      style={errors.description ? { borderColor: 'var(--error)' } : {}}
                      placeholder="Describe the issue in detail — how severe it is, how long it's been there, and any safety concerns..."
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={5}
                    />
                    {errors.description && <FieldError message={errors.description} />}
                    <span className="form-hint">{form.description.length} characters</span>
                  </div>

                  {/* Photo Upload */}
                  <div className="form-group">
                    <label className="form-label">Photo Evidence (Optional)</label>
                    <div
                      className={`upload-zone${dragover ? ' dragover' : ''}`}
                      onClick={() => document.getElementById('photo-upload').click()}
                      onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                      onDragLeave={() => setDragover(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragover(false);
                        handleFileChange(e.dataTransfer.files[0]);
                      }}
                    >
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(e.target.files[0])}
                      />
                      {form.photo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                          <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                          <div>
                            <p style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.9rem' }}>
                              {form.photo.name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                              {(form.photo.size / 1024).toFixed(1)} KB · Click to change
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="upload-icon">
                            <Upload size={24} />
                          </div>
                          <p className="upload-text">
                            Drop your photo here or <span style={{ color: 'var(--teal)', fontWeight: 700 }}>browse files</span>
                          </p>
                          <p className="upload-hint">JPG, PNG up to 10 MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Location + Ward */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="issue-location">
                        Location / Address <span>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <MapPin
                          size={16}
                          style={{
                            position: 'absolute', left: 14, top: '50%',
                            transform: 'translateY(-50%)', color: 'var(--gray-400)',
                            pointerEvents: 'none',
                          }}
                        />
                        <input
                          id="issue-location"
                          className="form-input"
                          style={{
                            paddingLeft: 40,
                            ...(errors.location ? { borderColor: 'var(--error)' } : {}),
                          }}
                          placeholder="Street name, landmark, area..."
                          value={form.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                        />
                      </div>
                      {errors.location && <FieldError message={errors.location} />}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="issue-ward">Ward / Zone</label>
                      <select
                        id="issue-ward"
                        className="form-input form-select"
                        value={form.ward}
                        onChange={(e) => handleChange('ward', e.target.value)}
                      >
                        <option value="">Select your ward</option>
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={i + 1} value={`Ward ${i + 1}`}>Ward {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reporter Info */}
                  <div style={{
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    border: '1px solid var(--gray-100)',
                  }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>
                      Your Information
                    </p>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="reporter-name">
                          Full Name <span>*</span>
                        </label>
                        <input
                          id="reporter-name"
                          className="form-input"
                          style={errors.name ? { borderColor: 'var(--error)' } : {}}
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {errors.name && <FieldError message={errors.name} />}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="reporter-phone">Phone Number</label>
                        <input
                          id="reporter-phone"
                          className="form-input"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          type="tel"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="form-footer">
                  <p className="form-note">
                    <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                    Your complaint will be reviewed within 24–48 hours
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setForm({
                        category: '', title: '', description: '', location: '',
                        ward: '', name: '', phone: '', photo: null,
                      })}
                    >
                      Clear Form
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg">
                      <MapPin size={16} />
                      Submit Complaint
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <SuccessModal
          id={complaintId}
          onClose={() => {
            setSubmitted(false);
            onNavigate('dashboard');
            window.scrollTo({ top: 0 });
          }}
        />
      )}
    </div>
  );
}

function FieldError({ message }) {
  return (
    <span style={{
      fontSize: '0.8rem',
      color: 'var(--error)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    }}>
      <AlertCircle size={13} />
      {message}
    </span>
  );
}

function SuccessModal({ id, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✓</div>
        <h2 className="modal-title">Complaint Submitted!</h2>
        <p className="modal-subtitle">
          Your complaint has been received and will be reviewed by the municipal team within 24–48 hours.
        </p>
        <div className="modal-id">
          <MapPin size={14} />
          Complaint ID: {id}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: 24 }}>
          Save this ID to track your complaint status
        </p>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
          View All Complaints →
        </button>
      </div>
    </div>
  );
}
