import React, { useEffect, useState } from 'react';
import { db } from '../data/db';
import {
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ttStyle = {
  contentStyle: { background: 'white', border: '1px solid #e2d9ce', borderRadius: 8, fontSize: 12.5 },
  labelStyle: { color: '#8a7264', fontWeight: 600 },
};

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [trend, setTrend]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState('name');

  useEffect(() => {
    Promise.all([db.getStudents(), db.getAttendanceTrend()]).then(([s, t]) => {
      setStudents(s); setTrend(t); setLoading(false);
    });
  }, []);

  const sorted = [...students].sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name) :
    sort === 'att_asc' ? a.attendance - b.attendance :
    b.attendance - a.attendance
  );

  const radarData = [
    { branch: 'CS', value: 93 },
    { branch: 'EC', value: 88 },
    { branch: 'ME', value: 85 },
    { branch: 'CE', value: 90 },
    { branch: 'IT', value: 91 },
  ];

  const counts = {
    above85: students.filter(s => s.attendance >= 85).length,
    mid:     students.filter(s => s.attendance >= 75 && s.attendance < 85).length,
    below75: students.filter(s => s.attendance < 75).length,
  };

  return (
    <div className="page">
      <div className="page-head fade-up">
        <div>
          <h1>Attendance</h1>
          <p>Aggregated from <code>attendance_records</code> collection</p>
        </div>
        <button className="btn btn-secondary" id="btn-export-attendance">Export CSV</button>
      </div>

      {/* Summary */}
      <div className="stat-grid fade-up-1">
        <div className="stat-card">
          <div className="stat-label">Campus average</div>
          <div className="stat-value">90%</div>
          <div className="stat-sub">All departments</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ color: 'var(--green)' }}>Above 85%</div>
          <div className="stat-value">{counts.above85}</div>
          <div className="stat-sub">Students on track</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ color: 'var(--yellow)' }}>75 – 85%</div>
          <div className="stat-value">{counts.mid}</div>
          <div className="stat-sub">Needs monitoring</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ color: 'var(--red)' }}>Below 75%</div>
          <div className="stat-value">{counts.below75}</div>
          <div className="stat-sub">At risk of debarment</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2 fade-up-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">Attendance Trend — Jul to Oct</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <defs>
                {[['gCS','#c97d3a'],['gEC','#3a7c52'],['gME','#2d6fa3'],['gCE','#b07d1a']].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={0.15}/>
                    <stop offset="100%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill: '#b3a090', fontSize: 11.5 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]}/>
              <Tooltip {...ttStyle}/>
              {[['CS','#c97d3a','gCS'],['EC','#3a7c52','gEC'],['ME','#2d6fa3','gME'],['CE','#b07d1a','gCE']].map(([k,c,g]) => (
                <Area key={k} type="monotone" dataKey={k} stroke={c} fill={`url(#${g})`} strokeWidth={1.6} dot={false}/>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Branch Performance</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
              <PolarGrid stroke="#e8e0d4"/>
              <PolarAngleAxis dataKey="branch" tick={{ fill: '#8a7264', fontSize: 12 }}/>
              <Radar dataKey="value" stroke="#c97d3a" fill="#c97d3a" fillOpacity={0.12} dot={{ fill: '#c97d3a', r: 3 }}/>
              <Tooltip {...ttStyle} formatter={v => [`${v}%`, 'Avg. Attendance']}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-wrap"><div className="spinner"/> Loading records…</div>
      ) : (
        <div className="card fade-up-3" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Attendance Register</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['name','Name'],['att_desc','Highest'],['att_asc','Lowest']].map(([v,l]) => (
                <button key={v} id={`sort-${v}`} onClick={() => setSort(v)} style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.1s', borderColor: sort === v ? 'var(--ink-900)' : 'var(--border)', background: sort === v ? 'var(--ink-900)' : 'white', color: sort === v ? 'white' : 'var(--ink-500)', fontWeight: sort === v ? 600 : 400 }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>Student</th>
                  <th>Roll no.</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Attendance</th>
                  <th style={{ paddingRight: 20 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s._id}>
                    <td style={{ paddingLeft: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sand-100)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-500)', flexShrink: 0 }}>
                          {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td><code>{s.roll}</code></td>
                    <td style={{ color: 'var(--ink-500)' }}>{s.branch}</td>
                    <td style={{ color: 'var(--ink-500)' }}>Year {s.year}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${s.attendance}%`, background: s.attendance >= 85 ? 'var(--green)' : s.attendance >= 75 ? 'var(--yellow)' : 'var(--red)' }}/>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, minWidth: 36 }}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td style={{ paddingRight: 20 }}>
                      <span className={`badge badge-${s.status === 'active' ? 'green' : s.status === 'warning' ? 'yellow' : 'red'}`}>
                        {s.status === 'active' ? 'OK' : s.status === 'warning' ? 'Low' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
