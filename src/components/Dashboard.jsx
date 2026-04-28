import { Users, AlertTriangle, TrendingUp, ShieldAlert, ArrowUpRight, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { haters, incidents, analyticsData, THREAT_LEVELS, MITIGATION_STATUS } from '../data/mockData';

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
  const color = value >= 8 ? '#ef4444' : value >= 6 ? '#f97316' : value >= 4 ? '#eab308' : '#22c55e';
  return (
    <div className="severity-bar">
      <div className="severity-track">
        <div className="severity-fill" style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className="severity-label" style={{ color }}>{value}</span>
    </div>
  );
}

const chartColors = ['#6366f1', '#818cf8', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

export default function Dashboard({ setActiveView, setSelectedHater }) {
  const activeIncidents = incidents.filter(i => i.mitigationStatus !== 'RESOLVED');
  const criticalHaters = haters.filter(h => h.threatLevel === 'CRITICAL' || h.threatLevel === 'SEVERE');
  const recentIncidents = [...incidents].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Situation Overview</h2>
        <p>Real-time threat landscape and incident monitoring</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Active Subjects</span>
            <Users size={16} />
          </div>
          <div className="stat-card-value">{haters.length}</div>
          <div className="stat-card-sub warning">{criticalHaters.length} at elevated threat</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Open Incidents</span>
            <AlertTriangle size={16} />
          </div>
          <div className="stat-card-value">{activeIncidents.length}</div>
          <div className="stat-card-sub danger">+3 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Avg Severity</span>
            <TrendingUp size={16} />
          </div>
          <div className="stat-card-value">
            {(incidents.reduce((a, i) => a + i.severity, 0) / incidents.length).toFixed(1)}
          </div>
          <div className="stat-card-sub warning">Trending upward</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Resolution Rate</span>
            <ShieldAlert size={16} />
          </div>
          <div className="stat-card-value">
            {Math.round(incidents.filter(i => i.mitigationStatus === 'RESOLVED').length / incidents.length * 100)}%
          </div>
          <div className="stat-card-sub success">4 resolved this month</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Incident Trend</h3>
            <button className="btn-link" onClick={() => setActiveView('analytics')}>
              Full Analytics <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.incidentsByMonth} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <XAxis dataKey="month" tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#e8e8f0' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {analyticsData.incidentsByMonth.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>High Priority Subjects</h3>
            <button className="btn-link" onClick={() => setActiveView('subjects')}>
              See All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="card-body no-pad">
            {criticalHaters.map(hater => (
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
                  <div className="hater-meta">{hater.relationship}</div>
                </div>
                <ThreatBadge level={hater.threatLevel} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Incidents</h3>
          <button className="btn-link" onClick={() => setActiveView('incidents')}>
            See All <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="card-body no-pad">
          {recentIncidents.map(incident => {
            const hater = haters.find(h => h.id === incident.haterId);
            const status = MITIGATION_STATUS[incident.mitigationStatus];
            return (
              <div key={incident.id} className="incident-item">
                <div className="incident-header">
                  <div className="incident-type">
                    <AlertTriangle size={14} style={{ color: incident.severity >= 8 ? '#ef4444' : '#eab308' }} />
                    {incident.type}
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}>
                      — {hater?.name}
                    </span>
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
                      {incident.evidence.length} evidence item{incident.evidence.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
