import React, { useEffect, useState } from 'react';
import { db } from '../data/db';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const toastStyle = {
  background: '#1a1410',
  border: '1px solid #3d2f23',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 12.5,
  color: '#f3efe9',
  boxShadow: '0 4px 12px rgba(26,20,16,0.15)',
};

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card fade-up">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [trend, setTrend]     = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);

  const loadData = () => {
    db.getDashboardStats().then(setStats);
    db.getAttendanceTrend().then(setTrend);
    db.getSemResults().then(setResults);
    db.getStudents().then(setStudents);
  };

  useEffect(() => {
    loadData();
  }, []);

  const branchPie = [
    { name: 'CS', value: 38 },
    { name: 'EC', value: 27 },
    { name: 'ME', value: 21 },
    { name: 'CE', value: 14 },
  ];
  const pieColors = ['#c97d3a', '#3a7c52', '#2d6fa3', '#b07d1a'];

  const atRisk = students.filter(s => s.status !== 'active').slice(0, 5);

  const ttStyle = {
    contentStyle: { background: 'white', border: '1px solid #e2d9ce', borderRadius: 8, fontSize: 12.5, boxShadow: '0 2px 8px rgba(26,20,16,0.08)' },
    itemStyle: { color: '#3d2f23' },
    labelStyle: { color: '#8a7264', fontWeight: 600 },
    cursor: { fill: 'rgba(201,125,58,0.06)' },
  };

  return (
    <div className="page">
      <div className="page-head fade-up">
        <div>
          <h1>Overview</h1>
          <p>SmartCampus · Academic Year 2026–27</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" id="btn-export-dash" onClick={() => alert('Exporting Campus Overview Summary...')}>Export</button>
          <button className="btn btn-primary" id="btn-refresh-dash" onClick={loadData}>
            Refresh
          </button>
        </div>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="stat-grid">
          <StatCard label="Total Students"    value={stats.totalStudents}    sub="Enrolled this semester" />
          <StatCard label="Active Classes"    value={stats.totalClasses}     sub="Across all departments" />
          <StatCard label="Avg. Attendance"   value={`${stats.avgAttendance}%`} sub="Campus-wide" />
          <StatCard label="Avg. CGPA"         value={stats.avgCgpa}          sub="All branches" />
          <StatCard label="Low Attendance"    value={stats.lowAttendance}    sub="Students below 75%" />
          <StatCard label="High Priority"     value={stats.highPriorityAnnouncements} sub="Open announcements" />
        </div>
      )}

      {/* Charts row */}
      <div className="grid-3 fade-up-1" style={{ marginBottom: 16 }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-title">Attendance by Department</div>
          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c97d3a" stopOpacity={0.18}/>
                    <stop offset="100%" stopColor="#c97d3a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gEC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a7c52" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#3a7c52" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false}/>
                <XAxis dataKey="month" tick={{ fill: '#b3a090', fontSize: 11.5 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]}/>
                <Tooltip {...ttStyle}/>
                <Area type="monotone" dataKey="CS" name="Comp. Sci" stroke="#c97d3a" fill="url(#gCS)" strokeWidth={1.8} dot={false}/>
                <Area type="monotone" dataKey="EC" name="Electronics" stroke="#3a7c52" fill="url(#gEC)" strokeWidth={1.8} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Branch Distribution</div>
          <div style={{ width: '100%', height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={branchPie} cx="50%" cy="50%" innerRadius={36} outerRadius={56} paddingAngle={3} dataKey="value" stroke="none">
                  {branchPie.map((_, i) => <Cell key={i} fill={pieColors[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2d9ce', borderRadius: 8, fontSize: 12.5 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginTop: 8 }}>
            {branchPie.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: pieColors[i], flexShrink: 0 }}/>
                <span style={{ color: '#8a7264' }}>{d.name}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#3d2f23' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2 fade-up-2">
        {/* CGPA progression */}
        <div className="card">
          <div className="card-title">CGPA Progression</div>
          <div style={{ width: '100%', height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false}/>
                <XAxis dataKey="sem" tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false} domain={[7, 10]}/>
                <Tooltip {...ttStyle} formatter={(v) => [v, 'Avg. CGPA']}/>
                <Bar dataKey="avg" fill="#c97d3a" radius={[3, 3, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Students needing attention */}
        <div className="card">
          <div className="card-title">Needs Attention</div>
          {atRisk.length === 0 ? (
            <div className="empty"><p>All students are on track.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {atRisk.map(s => (
                <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--sand-100)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--sand-100)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ink-500)', flexShrink: 0 }}>
                    {s.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-300)' }}>{s.roll} · {s.branch}</div>
                  </div>
                  <span className={`badge badge-${s.status === 'critical' ? 'red' : 'yellow'}`}>{s.attendance}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
