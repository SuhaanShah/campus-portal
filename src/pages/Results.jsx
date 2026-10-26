import React, { useEffect, useState } from 'react';
import { db } from '../data/db';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ttStyle = {
  contentStyle: { background: 'white', border: '1px solid #e2d9ce', borderRadius: 8, fontSize: 12.5 },
  labelStyle: { color: '#8a7264', fontWeight: 600 },
};

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Results() {
  const [students, setStudents] = useState([]);
  const [semData, setSemData]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sortBy, setSortBy]     = useState('cgpa');

  useEffect(() => {
    Promise.all([db.getStudents(), db.getSemResults()]).then(([s, r]) => {
      setStudents(s); setSemData(r); setLoading(false);
    });
  }, []);

  const sorted = [...students].sort((a, b) =>
    sortBy === 'cgpa' ? b.cgpa - a.cgpa : b.attendance - a.attendance
  );

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="page">
      <div className="page-head fade-up">
        <div>
          <h1>Results</h1>
          <p>Academic performance — aggregated from <code>results</code> collection</p>
        </div>
      </div>

      {/* Top 3 */}
      {!loading && (
        <div className="card fade-up-1" style={{ marginBottom: 16 }}>
          <div className="card-title">Top performers this semester</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {sorted.slice(0, 3).map((s, i) => (
              <div key={s._id} style={{ flex: '1 1 180px', background: i === 0 ? 'var(--accent-light)' : 'var(--sand-50)', border: `1px solid ${i === 0 ? '#e8c9a0' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{medals[i]}</span>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', flexShrink: 0 }}>
                  {initials(s.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink-900)' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-300)' }}>{s.roll} · CGPA {s.cgpa}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid-2 fade-up-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">Semester CGPA Trend</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={semData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false}/>
              <XAxis dataKey="sem" tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false} domain={[7, 10]}/>
              <Tooltip {...ttStyle} formatter={v => [v, 'Avg. CGPA']}/>
              <Line type="monotone" dataKey="avg" stroke="#c97d3a" strokeWidth={2} dot={{ fill: 'white', stroke: '#c97d3a', strokeWidth: 2, r: 4 }} activeDot={{ r: 5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Individual CGPA</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={students.map(s => ({ name: s.name.split(' ')[0], cgpa: s.cgpa }))} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill: '#b3a090', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#b3a090', fontSize: 11 }} axisLine={false} tickLine={false} domain={[6, 10]}/>
              <Tooltip {...ttStyle} formatter={v => [v, 'CGPA']}/>
              <Bar dataKey="cgpa" fill="#e8c9a0" radius={[3, 3, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard table */}
      {loading ? (
        <div className="loading-wrap fade-up-3"><div className="spinner"/> Loading…</div>
      ) : (
        <div className="card fade-up-3" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Leaderboard</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['cgpa','CGPA'],['attendance','Attendance']].map(([v, l]) => (
                <button key={v} id={`sort-by-${v}`} onClick={() => setSortBy(v)} style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', borderColor: sortBy === v ? 'var(--ink-900)' : 'var(--border)', background: sortBy === v ? 'var(--ink-900)' : 'white', color: sortBy === v ? 'white' : 'var(--ink-500)', fontWeight: 500 }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20, width: 48 }}>Rank</th>
                  <th>Student</th>
                  <th>Roll no.</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th style={{ paddingRight: 20 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ paddingLeft: 20 }}>
                      <span style={{ fontSize: i < 3 ? 16 : 12.5, color: i < 3 ? undefined : 'var(--ink-300)', fontWeight: i < 3 ? undefined : 500 }}>
                        {i < 3 ? medals[i] : `#${i + 1}`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sand-100)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-500)', flexShrink: 0 }}>
                          {initials(s.name)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td><code>{s.roll}</code></td>
                    <td style={{ color: 'var(--ink-500)' }}>{s.branch}</td>
                    <td style={{ fontWeight: 700, color: s.cgpa >= 9 ? 'var(--green)' : 'var(--ink-700)' }}>{s.cgpa}</td>
                    <td style={{ fontWeight: 600, color: s.attendance >= 85 ? 'var(--green)' : s.attendance >= 75 ? 'var(--yellow)' : 'var(--red)' }}>{s.attendance}%</td>
                    <td style={{ paddingRight: 20 }}>
                      <span className={`badge badge-${s.status === 'active' ? 'green' : s.status === 'warning' ? 'yellow' : 'red'}`}>
                        {s.status}
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
