import React, { useEffect, useState } from 'react';
import { db } from '../data/db';

const dayColor = {
  Monday: '#c97d3a', Tuesday: '#3a7c52', Wednesday: '#2d6fa3',
  Thursday: '#b07d1a', Friday: '#8a4faf',
};

export default function Classes() {
  const [classes, setClasses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeDay, setActiveDay] = useState('All');

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    db.getClasses().then(d => { setClasses(d); setLoading(false); });
  }, []);

  const visible = activeDay === 'All' ? classes : classes.filter(c => c.day === activeDay);

  return (
    <div className="page">
      <div className="page-head fade-up">
        <div>
          <h1>Class Schedule</h1>
          <p>Collection: <code>classes</code> · {classes.length} documents</p>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18 }} className="fade-up-1">
        {days.map(d => (
          <button
            key={d}
            id={`day-${d.toLowerCase()}`}
            onClick={() => setActiveDay(d)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: activeDay === d ? (d === 'All' ? 'var(--ink-900)' : dayColor[d] || 'var(--ink-900)') : 'var(--border)',
              background: activeDay === d ? (d === 'All' ? 'var(--ink-900)' : `${dayColor[d]}15`) : 'white',
              color: activeDay === d ? (d === 'All' ? 'white' : dayColor[d] || 'var(--ink-900)') : 'var(--ink-500)',
              fontSize: 12.5,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-wrap fade-up-2"><div className="spinner"/> Loading classes…</div>
      ) : (
        <>
          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }} className="fade-up-2">
            {visible.map(cls => {
              const color = dayColor[cls.day] || '#8a7264';
              return (
                <div key={cls._id} className="card" style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid ${color}` }}>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <code style={{ fontSize: 11, color, background: `${color}15`, borderColor: `${color}33` }}>{cls.code}</code>
                      <span style={{ fontSize: 11, color: 'var(--ink-300)', background: 'var(--sand-100)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>{cls.day}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 4, lineHeight: 1.3 }}>{cls.subject}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-300)', marginBottom: 14 }}>{cls.professor}</div>
                    <hr className="divider" style={{ margin: '0 0 12px' }}/>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--ink-300)', marginBottom: 2 }}>Time</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{cls.time}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--ink-300)', marginBottom: 2 }}>Room</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{cls.room}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--ink-300)', marginBottom: 2 }}>Duration</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{cls.duration} min</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--ink-300)', marginBottom: 2 }}>Enrolled</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{cls.enrolled}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full timetable table */}
          <div className="card fade-up-3" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
              <div className="card-title" style={{ marginBottom: 0 }}>Full Timetable</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 20 }}>Subject</th>
                    <th>Code</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Professor</th>
                    <th style={{ paddingRight: 20 }}>Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => {
                    const color = dayColor[cls.day] || '#8a7264';
                    return (
                      <tr key={cls._id}>
                        <td style={{ paddingLeft: 20, fontWeight: 600 }}>{cls.subject}</td>
                        <td><code>{cls.code}</code></td>
                        <td>
                          <span className="badge" style={{ background: `${color}15`, color, borderColor: `${color}33` }}>{cls.day}</span>
                        </td>
                        <td style={{ color: 'var(--ink-500)' }}>{cls.time}</td>
                        <td style={{ color: 'var(--ink-500)' }}>{cls.room}</td>
                        <td style={{ color: 'var(--ink-500)' }}>{cls.professor}</td>
                        <td style={{ paddingRight: 20, fontWeight: 600 }}>{cls.enrolled}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
