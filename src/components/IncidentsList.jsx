import { useState } from 'react';
import { Search, Plus, AlertTriangle, Clock, FileText, Eye } from 'lucide-react';
import { haters, incidents, THREAT_LEVELS, MITIGATION_STATUS } from '../data/mockData';

function SeverityBar({ value }) {
  const color = value >= 8 ? '#ff4d6a' : value >= 6 ? '#f97316' : value >= 4 ? '#ffb800' : '#00ff88';
  return (
    <div className="severity-bar">
      <div className="severity-track">
        <div className="severity-fill" style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className="severity-label" style={{ color }}>{value}</span>
    </div>
  );
}

export default function IncidentsList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const sorted = [...incidents].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = sorted.filter(i => {
    const hater = haters.find(h => h.id === i.haterId);
    const matchesSearch = i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.type.toLowerCase().includes(search.toLowerCase()) ||
      hater?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || i.mitigationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h2>drama log</h2>
            <p>everything that's gone down, documented</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={13} />
            log it
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        <div className="search-bar">
          <Search size={14} />
          <input
            type="text"
            placeholder="search incidents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['ALL', ...Object.keys(MITIGATION_STATUS)].map(status => (
            <button
              key={status}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'ALL' ? 'all' : MITIGATION_STATUS[status]?.label || status}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h4>nothing matches those filters</h4>
              <p>try adjusting your search</p>
            </div>
          ) : (
            filtered.map(incident => {
              const hater = haters.find(h => h.id === incident.haterId);
              const status = MITIGATION_STATUS[incident.mitigationStatus];
              return (
                <div key={incident.id} className="incident-item">
                  <div className="incident-header">
                    <div className="incident-type">
                      <AlertTriangle size={13} style={{ color: incident.severity >= 8 ? '#ff4d6a' : incident.severity >= 6 ? '#f97316' : '#ffb800' }} />
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
                    <span className="incident-meta" style={{ color: 'var(--accent)' }}>
                      {hater?.name}
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
