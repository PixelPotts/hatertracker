import { Search, Filter, Plus } from 'lucide-react';
import { haters, incidents, THREAT_LEVELS } from '../data/mockData';
import { useState } from 'react';

function ThreatBadge({ level }) {
  const config = THREAT_LEVELS[level];
  return (
    <span className="threat-badge" style={{ background: config.bg, color: config.color }}>
      <span className="threat-dot" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

export default function SubjectsList({ setActiveView, setSelectedHater }) {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');

  const filtered = haters.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.alias.toLowerCase().includes(search.toLowerCase()) ||
      h.tags.some(t => t.includes(search.toLowerCase()));
    const matchesLevel = filterLevel === 'ALL' || h.threatLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const sorted = [...filtered].sort((a, b) => {
    const order = ['CRITICAL', 'SEVERE', 'HIGH', 'MODERATE', 'LOW'];
    return order.indexOf(a.threatLevel) - order.indexOf(b.threatLevel);
  });

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h2>watchlist</h2>
            <p>everyone who's been acting up</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={13} />
            add to list
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <div className="search-bar">
          <Search size={14} />
          <input
            type="text"
            placeholder="search people, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['ALL', 'CRITICAL', 'SEVERE', 'HIGH', 'MODERATE', 'LOW'].map(level => (
            <button
              key={level}
              className={`btn btn-sm ${filterLevel === level ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterLevel(level)}
            >
              {level === 'ALL' ? 'all' : THREAT_LEVELS[level]?.label || level}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          {sorted.map(hater => {
            const haterIncidents = incidents.filter(i => i.haterId === hater.id);
            return (
              <div
                key={hater.id}
                className="hater-row"
                onClick={() => { setSelectedHater(hater.id); setActiveView('detail'); }}
              >
                <div
                  className="hater-avatar"
                  style={{ background: THREAT_LEVELS[hater.threatLevel].bg, color: THREAT_LEVELS[hater.threatLevel].color }}
                >
                  {hater.name.charAt(0)}
                </div>
                <div className="hater-info">
                  <div className="hater-name">
                    {hater.name}
                    <span className="hater-alias">"{hater.alias}"</span>
                  </div>
                  <div className="hater-meta">
                    {hater.relationship} · since {new Date(hater.firstEncounter).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="tags" style={{ maxWidth: 200 }}>
                  {hater.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="hater-stats">
                  <div className="hater-stat">
                    <div className="hater-stat-value" style={{ color: hater.activeIncidents > 3 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {hater.activeIncidents}
                    </div>
                    <div className="hater-stat-label">active</div>
                  </div>
                  <div className="hater-stat">
                    <div className="hater-stat-value" style={{ color: 'var(--success)' }}>
                      {hater.resolvedIncidents}
                    </div>
                    <div className="hater-stat-label">handled</div>
                  </div>
                </div>
                <ThreatBadge level={hater.threatLevel} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
