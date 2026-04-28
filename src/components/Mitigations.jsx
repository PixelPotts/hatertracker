import { mitigationStrategies, THREAT_LEVELS } from '../data/mockData';
import { Shield, Zap, Users, Globe, Scale, MessageCircle, Lock } from 'lucide-react';

const categoryIcons = {
  Behavioral: Zap,
  Procedural: Shield,
  Social: Users,
  Digital: Globe,
  Legal: Scale,
};

export default function Mitigations() {
  const categories = [...new Set(mitigationStrategies.map(s => s.category))];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>the playbook</h2>
        <p>how to actually deal with these people</p>
      </div>

      <div className="info-box">
        Strategies are matched to threat levels. Higher levels unlock more aggressive options.
        Always keep receipts as a baseline no matter what.
      </div>

      {categories.map(category => {
        const Icon = categoryIcons[category] || Shield;
        const strategies = mitigationStrategies.filter(s => s.category === category);
        return (
          <div key={category} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <Icon size={16} style={{ color: 'var(--accent)' }} />
              {category.toLowerCase()}
            </h3>
            <div className="grid-2" style={{ marginBottom: 0 }}>
              {strategies.map(strat => (
                <div key={strat.id} className="mitigation-card">
                  <h4>{strat.name}</h4>
                  <p>{strat.description}</p>
                  <div style={{ marginTop: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {strat.applicableThreatLevels.map(level => (
                      <span
                        key={level}
                        className="threat-badge"
                        style={{
                          background: THREAT_LEVELS[level].bg,
                          color: THREAT_LEVELS[level].color,
                          fontSize: 9,
                          padding: '2px 7px',
                        }}
                      >
                        {THREAT_LEVELS[level].label}
                      </span>
                    ))}
                  </div>
                  <div className="mitigation-effectiveness" style={{ marginTop: 8 }}>
                    {strat.effectiveness}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="card" style={{ marginTop: 28 }}>
        <div className="card-header">
          <h3>ground rules</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { icon: Shield, title: 'keep the receipts', desc: 'Timestamps, screenshots, witnesses — document everything as it happens.' },
              { icon: Lock, title: 'lock it down', desc: 'Audit your digital presence, max out privacy settings, shrink the attack surface.' },
              { icon: Users, title: 'squad up', desc: 'Build solid relationships in shared spaces before you need them.' },
              { icon: MessageCircle, title: 'own your story', desc: 'Don\'t let them define you. Stay visible and authentic in your circles.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ padding: 8, background: 'var(--accent-dim)', borderRadius: 10, flexShrink: 0 }}>
                  <item.icon size={15} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3, letterSpacing: '-0.1px' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
