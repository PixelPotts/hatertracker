import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, CartesianGrid } from 'recharts';
import { analyticsData, haters, incidents, THREAT_LEVELS } from '../data/mockData';

const COLORS = ['#a855f7', '#c084fc', '#f472b6', '#fb7185', '#38bdf8', '#00ff88', '#ffb800', '#34d399'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '8px 12px', fontSize: 11, fontFamily: 'Space Grotesk' }}>
      <div style={{ color: '#f0f0f5', fontWeight: 600 }}>{label || payload[0]?.name}</div>
      <div style={{ color: '#8b8ba3' }}>{payload[0]?.value} incidents</div>
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
        <h2>stats</h2>
        <p>the numbers behind the nonsense</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header"><span>total incidents</span></div>
          <div className="stat-card-value">{incidents.length}</div>
          <div className="stat-card-sub">across {haters.length} people</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>most active platform</span></div>
          <div className="stat-card-value" style={{ fontSize: 18 }}>Twitter/X</div>
          <div className="stat-card-sub warning">tied with 3 others</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>peak month</span></div>
          <div className="stat-card-value" style={{ fontSize: 18 }}>Apr 2025</div>
          <div className="stat-card-sub danger">7 incidents (+75%)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>worst vibes</span></div>
          <div className="stat-card-value" style={{ fontSize: 18, color: '#dc2626' }}>unhinged</div>
          <div className="stat-card-sub">1 person at this level</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>incidents over time</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.incidentsByMonth} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#52526b', fontSize: 10, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#52526b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#c084fc' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>threat level breakdown</h3>
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
                    labelLine={{ stroke: '#52526b' }}
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
            <h3>by type</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.incidentsByType} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 60 }}>
                  <XAxis type="number" tick={{ fill: '#52526b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="type" tick={{ fill: '#8b8ba3', fontSize: 10, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
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
            <h3>avg severity per person</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgSeverityByHater} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <XAxis dataKey="name" tick={{ fill: '#52526b', fontSize: 9, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#52526b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                    {avgSeverityByHater.map((entry, i) => (
                      <Cell key={i} fill={entry.avg >= 8 ? '#ff4d6a' : entry.avg >= 6 ? '#f97316' : '#a855f7'} />
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
          <h3>where it's happening</h3>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.platformBreakdown} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <XAxis dataKey="platform" tick={{ fill: '#52526b', fontSize: 10, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52526b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#c084fc" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
