import React, { useEffect, useState } from 'react';
import { db } from '../data/db';
import { Icons } from '../Icons';

const statusBadge = {
  active:   { cls: 'badge-green',  label: 'Active'   },
  warning:  { cls: 'badge-yellow', label: 'Warning'  },
  critical: { cls: 'badge-red',    label: 'Critical' },
};

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', roll: '', branch: 'Computer Sci.', year: '2', email: '', cgpa: '', attendance: '85' });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const doc = await db.addStudent(form);
    onAdd(doc);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-head">
          <h2>Add Student</h2>
          <button className="modal-close" onClick={onClose}><Icons.X/></button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-300)', marginBottom: 16 }}>
          Inserts a new document into the <code>students</code> collection.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field">
              <label htmlFor="f-name">Full name</label>
              <input id="f-name" className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rohit Verma"/>
            </div>
            <div className="field">
              <label htmlFor="f-roll">Roll number</label>
              <input id="f-roll" className="input" required value={form.roll} onChange={e => set('roll', e.target.value)} placeholder="e.g. CS21009"/>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field">
              <label htmlFor="f-branch">Branch</label>
              <select id="f-branch" className="input" value={form.branch} onChange={e => set('branch', e.target.value)}>
                <option>Computer Sci.</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-year">Year</label>
              <select id="f-year" className="input" value={form.year} onChange={e => set('year', e.target.value)}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input id="f-email" className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@campus.edu"/>
            </div>
            <div className="field">
              <label htmlFor="f-pass">Initial Login Password</label>
              <input id="f-pass" className="input" type="text" value={form.password || ''} onChange={e => set('password', e.target.value)} placeholder="Default: student@123"/>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12, marginBottom: 20 }}>
            <div className="field">
              <label htmlFor="f-cgpa">CGPA</label>
              <input id="f-cgpa" className="input" type="number" min="0" max="10" step="0.1" value={form.cgpa} onChange={e => set('cgpa', e.target.value)} placeholder="8.5"/>
            </div>
            <div className="field">
              <label htmlFor="f-att">Attendance %</label>
              <input id="f-att" className="input" type="number" min="0" max="100" value={form.attendance} onChange={e => set('attendance', e.target.value)}/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" id="btn-submit-student" className="btn btn-primary" disabled={saving}>
              {saving ? 'Adding…' : 'Add student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [modal, setModal]       = useState(false);

  useEffect(() => {
    db.getStudents().then(d => { setStudents(d); setLoading(false); });
  }, []);

  const visible = students.filter(s => {
    const matchQ = !search || [s.name, s.roll, s.branch].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchF = filter === 'all' || s.status === filter;
    return matchQ && matchF;
  });

  const mark = async (id, delta) => {
    const updated = await db.markAttendance(id, delta);
    if (updated) setStudents(prev => prev.map(s => s._id === id ? updated : s));
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-head fade-up">
        <div>
          <h1>Students</h1>
          <p>Collection: <code>students</code> · {students.length} documents</p>
        </div>
        <button className="btn btn-primary" id="btn-add-student" onClick={() => setModal(true)}>
          <Icons.Plus/> Add student
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }} className="fade-up-1">
        <div className="topbar-search" style={{ flex: '0 1 280px' }}>
          <Icons.Search/>
          <input id="search-students" placeholder="Search name, roll, branch…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'active', 'warning', 'critical'].map(f => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 11px',
                borderRadius: 6,
                border: '1px solid',
                borderColor: filter === f ? 'var(--ink-900)' : 'var(--border)',
                background: filter === f ? 'var(--ink-900)' : 'white',
                color: filter === f ? 'white' : 'var(--ink-500)',
                fontSize: 12.5,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-300)', marginLeft: 'auto' }}>{visible.length} of {students.length}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-wrap fade-up-2"><div className="spinner"/> Fetching from MongoDB…</div>
      ) : (
        <div className="card fade-up-2" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>Student</th>
                  <th>Roll no.</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th style={{ paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(s => (
                  <tr key={s._id}>
                    <td style={{ paddingLeft: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--sand-100)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-500)', flexShrink: 0 }}>
                          {initials(s.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{s.name}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--ink-300)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>{s.roll}</code></td>
                    <td style={{ color: 'var(--ink-500)' }}>{s.branch}</td>
                    <td style={{ color: 'var(--ink-500)' }}>Year {s.year}</td>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ color: s.cgpa >= 9 ? 'var(--green)' : s.cgpa >= 8 ? 'var(--ink-900)' : 'var(--yellow)' }}>
                        {s.cgpa}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress" style={{ width: 64 }}>
                          <div className="progress-fill" style={{ width: `${s.attendance}%`, background: s.attendance >= 85 ? 'var(--green)' : s.attendance >= 75 ? 'var(--yellow)' : 'var(--red)' }}/>
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-700)', minWidth: 32 }}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${statusBadge[s.status].cls}`}>{statusBadge[s.status].label}</span></td>
                    <td style={{ paddingRight: 20 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button id={`btn-present-${s._id}`} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => mark(s._id, 1)}>+P</button>
                        <button id={`btn-absent-${s._id}`} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => mark(s._id, -1)}>-A</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={8} className="empty"><p>No students match your filters.</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && <AddStudentModal onClose={() => setModal(false)} onAdd={doc => setStudents(p => [...p, doc])}/>}
    </div>
  );
}
