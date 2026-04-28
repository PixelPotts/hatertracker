import { LayoutDashboard, Users, AlertTriangle, BarChart3, Shield, Settings, FileText } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subjects', label: 'Subjects', icon: Users },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'mitigations', label: 'Mitigations', icon: Shield },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h1>HaterTracker</h1>
        <p>Threat Intelligence</p>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Analysis</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon />
            {item.label}
          </button>
        ))}
        <div className="nav-section-label">System</div>
        <button className="nav-item">
          <FileText />
          Reports
        </button>
        <button className="nav-item">
          <Settings />
          Settings
        </button>
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          v0.1.0 — Analytical Build
        </div>
      </div>
    </div>
  );
}
