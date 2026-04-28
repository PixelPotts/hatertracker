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
        <h2>Mitigation Strategies</h2>
        <p>Evidence-based approaches for addressing and de-escalating antagonistic behavior</p>
      </div>

      <div className="info-box">
        Strategies are matched to threat levels. Higher threat levels unlock more aggressive mitigation options.
        Always maintain documentation as a foundation regardless of threat level.
      </div>

      {categories.map(category => {
        const Icon = categoryIcons[category] || Shield;
        const strategies = mitigationStrategies.filter(s => s.category === category);
        return (
          <div key={category} style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={18} style={{ color: 'var(--accent)' }} />
              {category}
            </h3>
            <div className="grid-2" style={{ marginBottom: 0 }}>
              {strategies.map(strat => (
                <div key={strat.id} className="mitigation-card">
                  <h4>{strat.name}</h4>
                  <p>{strat.description}</p>
                  <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {strat.applicableThreatLevels.map(level => (
                      <span
                        key={level}
                        className="threat-badge"
                        style={{
                          background: THREAT_LEVELS[level].bg,
                          color: THREAT_LEVELS[level].color,
                          fontSize: 9,
                          padding: '2px 6px',
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

      <div className="card" style={{ marginTop: 32 }}>
        <div className="card-header">
          <h3>General Principles</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { icon: Shield, title: 'Document Everything', desc: 'Maintain timestamped records of all incidents with evidence.' },
              { icon: Lock, title: 'Protect Your Perimeter', desc: 'Audit digital presence, lock down privacy settings, minimize attack surface.' },
              { icon: Users, title: 'Build Alliances', desc: 'Cultivate relationships with key people in shared spaces proactively.' },
              { icon: MessageCircle, title: 'Control the Narrative', desc: 'Don\'t let others define you. Be visible and authentic in your circles.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ padding: 8, background: 'var(--accent-dim)', borderRadius: 8, flexShrink: 0 }}>
                  <item.icon size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
