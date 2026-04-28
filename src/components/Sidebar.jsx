import { LayoutDashboard, Users, AlertTriangle, BarChart3, Shield, Settings, FileText, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
  { id: 'subjects', label: 'watchlist', icon: Users },
  { id: 'incidents', label: 'drama log', icon: AlertTriangle },
  { id: 'analytics', label: 'stats', icon: BarChart3 },
  { id: 'mitigations', label: 'playbook', icon: Shield },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h1>HaterTracker</h1>
        <p>keeping receipts</p>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">intel</div>
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
        <div className="nav-section-label">config</div>
        <button className="nav-item">
          <FileText />
          reports
        </button>
        <button className="nav-item">
          <Settings />
          settings
        </button>
      </nav>
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
          v0.1.0 — beta
        </div>
      </div>
    </div>
  );
}
