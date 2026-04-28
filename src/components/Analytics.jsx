import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, CartesianGrid } from 'recharts';
import { analyticsData, haters, incidents, THREAT_LEVELS } from '../data/mockData';

const COLORS = ['#6366f1', '#818cf8', '#a855f7', '#c084fc', '#f472b6', '#fb923c', '#fbbf24', '#34d399'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ color: '#e8e8f0', fontWeight: 600 }}>{label || payload[0]?.name}</div>
      <div style={{ color: '#8888a0' }}>{payload[0]?.value} incidents</div>
    </div>
  );
}

export default function Analytics() {
  const threatDistribution = Object.entries(
    haters.reduce((acc, h) => { acc[h.threatLevel] = (acc[h.threatLevel] || 0) + 1; return acc; }, {})
  ).map(([level, count]) => ({ name: THREAT_LEVELS[level].label, value: count, color: THREAT_LEVELS[level].color }));

  const avgSeverityByHater = haters.map(h => {
    const hIncidents = incidents.filter(i => i.haterId === h.id);
    const avg = hIncidents.length ? (hIncidents.reduce((a, i) => a + i.severity, 0) / hIncidents.length).toFixed(1) : 0;
    return { name: h.alias, avg: parseFloat(avg), count: hIncidents.length };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Analytics</h2>
        <p>Statistical breakdown and pattern analysis across all tracked subjects</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header"><span>Total Incidents</span></div>
          <div className="stat-card-value">{incidents.length}</div>
          <div className="stat-card-sub">Across {haters.length} subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>Most Active Platform</span></div>
          <div className="stat-card-value" style={{ fontSize: 20 }}>Twitter/X</div>
          <div className="stat-card-sub warning">Tied with 3 others</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>Peak Month</span></div>
          <div className="stat-card-value" style={{ fontSize: 20 }}>Apr 2025</div>
          <div className="stat-card-sub danger">7 incidents (75% increase)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>Highest Threat</span></div>
          <div className="stat-card-value" style={{ fontSize: 20, color: '#dc2626' }}>Critical</div>
          <div className="stat-card-sub">1 subject at this level</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Incidents Over Time</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.incidentsByMonth} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis dataKey="month" tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Threat Level Distribution</h3>
          </div>
          <div className="card-body">
            <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={{ stroke: '#5a5a72' }}
                  >
                    {threatDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Incidents by Type</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.incidentsByType} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 60 }}>
                  <XAxis type="number" tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="type" tick={{ fill: '#8888a0', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {analyticsData.incidentsByType.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Average Severity by Subject</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgSeverityByHater} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <XAxis dataKey="name" tick={{ fill: '#5a5a72', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {avgSeverityByHater.map((entry, i) => (
                      <Cell key={i} fill={entry.avg >= 8 ? '#ef4444' : entry.avg >= 6 ? '#f97316' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Platform Activity Breakdown</h3>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.platformBreakdown} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <XAxis dataKey="platform" tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5a5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
