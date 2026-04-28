import { ArrowLeft, AlertTriangle, Clock, FileText, Eye, Shield } from 'lucide-react';
import { haters, incidents, THREAT_LEVELS, MITIGATION_STATUS, mitigationStrategies } from '../data/mockData';

function ThreatBadge({ level }) {
  const config = THREAT_LEVELS[level];
  return (
    <span className="threat-badge" style={{ background: config.bg, color: config.color }}>
      <span className="threat-dot" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

function SeverityBar({ value }) {
  const color = value >= 8 ? '#ff4d6a' : value >= 6 ? '#f97316' : value >= 4 ? '#ffb800' : '#00ff88';
  return (
    <div className="severity-bar">
      <div className="severity-track">
        <div className="severity-fill" style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className="severity-label" style={{ color }}>{value}/10</span>
    </div>
  );
}

export default function SubjectDetail({ haterId, setActiveView }) {
  const hater = haters.find(h => h.id === haterId);
  if (!hater) return null;

  const haterIncidents = incidents
    .filter(i => i.haterId === haterId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const recommendedStrategies = mitigationStrategies.filter(s =>
    s.applicableThreatLevels.includes(hater.threatLevel)
  );

  return (
    <div className="animate-in">
      <button className="back-btn" onClick={() => setActiveView('subjects')}>
        <ArrowLeft size={13} />
        back to watchlist
      </button>

      <div className="detail-panel">
        <div className="detail-header">
          <div className="detail-title">
            <div
              className="detail-avatar"
              style={{ background: THREAT_LEVELS[hater.threatLevel].bg, color: THREAT_LEVELS[hater.threatLevel].color }}
            >
              {hater.name.charAt(0)}
            </div>
            <div className="detail-name">
              <h3>{hater.name}</h3>
              <div className="detail-subtitle">
                "{hater.alias}" · {hater.relationship}
              </div>
            </div>
          </div>
          <ThreatBadge level={hater.threatLevel} />
        </div>

        <div className="detail-body">
          <div className="detail-grid">
            <div className="detail-field">
              <label>first encounter</label>
              <p>{new Date(hater.firstEncounter).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="detail-field">
              <label>active incidents</label>
              <p style={{ color: hater.activeIncidents > 3 ? 'var(--danger)' : 'inherit' }}>
                {hater.activeIncidents}
              </p>
            </div>
            <div className="detail-field">
              <label>handled</label>
              <p style={{ color: 'var(--success)' }}>{hater.resolvedIncidents}</p>
            </div>
          </div>

          <div className="detail-field" style={{ marginBottom: 16 }}>
            <label>notes</label>
            <p>{hater.notes}</p>
          </div>

          <div className="detail-field">
            <label>what's their deal</label>
            <p>{hater.motivationAnalysis}</p>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 9, textTransform: 'lowercase', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
              tags
            </label>
            <div className="tags">
              {hater.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </div>

          <div className="detail-section">
            <h4>
              <AlertTriangle size={12} style={{ display: 'inline', marginRight: 6 }} />
              timeline ({haterIncidents.length})
            </h4>
            {haterIncidents.map(incident => {
              const status = MITIGATION_STATUS[incident.mitigationStatus];
              return (
                <div key={incident.id} className="incident-item" style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className="incident-header">
                    <div className="incident-type">
                      {incident.type}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <SeverityBar value={incident.severity} />
                      <span className="incident-date">{incident.date}</span>
                    </div>
                  </div>
                  <div className="incident-desc">{incident.description}</div>
                  <div className="incident-footer">
                    <span className="status-badge" style={{ color: status.color }}>
                      <span className="threat-dot" style={{ background: status.color }} />
                      {status.label}
                    </span>
                    <span className="incident-meta">
                      <Clock size={10} />
                      {incident.platform}
                    </span>
                    {incident.evidence.length > 0 && (
                      <span className="incident-meta">
                        <FileText size={10} />
                        {incident.evidence.length} receipt{incident.evidence.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {incident.witnesses.length > 0 && (
                      <span className="incident-meta">
                        <Eye size={10} />
                        {incident.witnesses.length} saw it
                      </span>
                    )}
                  </div>
                  {incident.mitigationNotes && (
                    <div className="info-box" style={{ marginTop: 10, marginBottom: 0 }}>
                      <strong style={{ fontSize: 10, color: 'var(--text-muted)' }}>game plan:</strong>{' '}
                      {incident.mitigationNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="detail-section">
            <h4>
              <Shield size={12} style={{ display: 'inline', marginRight: 6 }} />
              recommended moves
            </h4>
            <div className="grid-2" style={{ marginBottom: 0 }}>
              {recommendedStrategies.map(strat => (
                <div key={strat.id} className="mitigation-card">
                  <div className="mitigation-category">{strat.category}</div>
                  <h4>{strat.name}</h4>
                  <p>{strat.description}</p>
                  <div className="mitigation-effectiveness">{strat.effectiveness}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
