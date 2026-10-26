import React, { useEffect, useState } from 'react';
import { db } from '../data/db';
import { Icons } from '../Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard({ student, onNavigate, onUpdateUser }) {
  const [classes, setClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [semResults, setSemResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    Promise.all([
      db.getClasses(),
      db.getAnnouncements(),
      db.getSemResults(),
    ]).then(([c, a, r]) => {
      setClasses(c);
      setAnnouncements(a.slice(0, 3));
      setSemResults(r);
      setLoading(false);
    });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg({ text: '', type: '' });

    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setSavingPw(true);
    const res = await db.changePassword(student._id, pwForm.current, pwForm.next);
    setSavingPw(false);

    if (res.success) {
      setPwMsg({ text: 'Password changed successfully! Keep your new password safe.', type: 'success' });
      if (onUpdateUser) {
        onUpdateUser({ ...student, password: pwForm.next });
      }
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwForm({ current: '', next: '', confirm: '' });
        setPwMsg({ text: '', type: '' });
      }, 1500);
    } else {
      setPwMsg({ text: res.error || 'Failed to update password.', type: 'error' });
    }
  };

  const getAttendanceStatus = (att) => {
    if (att >= 85) return { label: 'Good Standing', color: 'var(--green)', bg: 'var(--green-bg)' };
    if (att >= 75) return { label: 'Average', color: 'var(--yellow)', bg: 'var(--yellow-bg)' };
    return { label: 'Attendance Shortage Warning', color: 'var(--red)', bg: 'var(--red-bg)' };
  };

  const status = getAttendanceStatus(student.attendance || 85);

  return (
    <div className="page">
      {/* Student Welcome Banner */}
      <div className="student-hero-card fade-up">
        <div className="student-hero-left">
          <div className="student-avatar-lg">
            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 className="student-hero-title">{student.name}</h1>
              <span className="badge badge-sand">{student.roll}</span>
              <span className="badge badge-blue">{student.branch} · Year {student.year}</span>
            </div>
            <p className="student-hero-sub">
              Logged in to Individual Student Account · {student.email}
            </p>
          </div>
        </div>

        <div className="student-hero-right">
          <button
            className="btn btn-secondary"
            onClick={() => setShowPasswordModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Icons.Lock />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Attendance Shortage Alert if < 75% */}
      {student.attendance < 75 && (
        <div className="login-alert login-alert-error fade-up" style={{ marginTop: 16 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <strong>Attendance Warning:</strong> Your current overall attendance is {student.attendance}%, which is below the mandatory university threshold of 75%. Please attend upcoming classes to avoid exam condonation penalties.
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="stat-grid fade-up-1" style={{ marginTop: 18 }}>
        <div className="stat-card">
          <div className="stat-label">Cumulative GPA</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{student.cgpa || '8.5'}</div>
          <div className="stat-sub">Out of 10.0 scale · Ranked in top 10%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Overall Attendance</div>
          <div className="stat-value" style={{ color: status.color }}>
            {student.attendance}%
          </div>
          <div className="stat-sub" style={{ color: status.color, fontWeight: 500 }}>
            {status.label}
          </div>
          <div style={{ marginTop: 8, background: 'var(--sand-200)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${student.attendance}%`,
                background: status.color,
                height: '100%',
                borderRadius: 3,
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Enrolled Semester</div>
          <div className="stat-value">Sem {student.year * 2}</div>
          <div className="stat-sub">{student.branch} Department</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Account Security</div>
          <div className="stat-value" style={{ fontSize: 18, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icons.Shield />
            <span>Active & Protected</span>
          </div>
          <div className="stat-sub">Password verified for {student.roll}</div>
        </div>
      </div>

      {/* Two Column Layout: Classes & Notices */}
      <div className="grid-2 fade-up-2" style={{ marginTop: 20 }}>
        {/* Enrolled Classes */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">My Weekly Timetable</div>
              <p style={{ fontSize: 12, color: 'var(--ink-300)' }}>Scheduled lectures & lab sessions</p>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('classes')} style={{ fontSize: 12, padding: '4px 10px' }}>
              Full Schedule
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {classes.slice(0, 4).map((c) => (
              <div
                key={c._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--sand-50)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)' }}>{c.subject}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-300)' }}>
                    {c.code} · {c.professor} · Room: {c.room}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-sand" style={{ fontSize: 11 }}>{c.day}</span>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)', marginTop: 2 }}>
                    {c.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Announcements */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Campus Notices & Deadlines</div>
              <p style={{ fontSize: 12, color: 'var(--ink-300)' }}>University academic communications</p>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('announcements')} style={{ fontSize: 12, padding: '4px 10px' }}>
              All Notices
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {announcements.map((a) => (
              <div
                key={a._id}
                style={{
                  padding: '12px 14px',
                  background: a.priority === 'high' ? 'var(--red-bg)' : 'var(--sand-50)',
                  border: `1px solid ${a.priority === 'high' ? '#f5c6cb' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)' }}>
                    {a.title}
                  </span>
                  <span className={`badge ${a.priority === 'high' ? 'badge-red' : 'badge-blue'}`} style={{ fontSize: 10.5 }}>
                    {a.category.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: 0, lineHeight: 1.4 }}>
                  {a.body}
                </p>
                <div style={{ fontSize: 11, color: 'var(--ink-300)', marginTop: 6 }}>
                  Posted by {a.author} · {a.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Trend Chart */}
      <div className="card fade-up-3" style={{ marginTop: 20 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Semester Performance Trajectory</div>
            <p style={{ fontSize: 12, color: 'var(--ink-300)' }}>Average GPA progression across academic semesters</p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('results')} style={{ fontSize: 12, padding: '4px 10px' }}>
            View Full Results
          </button>
        </div>

        <div style={{ height: 200, marginTop: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={semResults}>
              <defs>
                <linearGradient id="studentCgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c97d3a" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#c97d3a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" />
              <XAxis dataKey="sem" stroke="#8a7264" fontSize={11.5} />
              <YAxis domain={[6, 10]} stroke="#8a7264" fontSize={11.5} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e2d9ce', borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="avg" stroke="#c97d3a" strokeWidth={2.5} fillOpacity={1} fill="url(#studentCgpaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowPasswordModal(false)}>
          <div className="modal-box fade-up">
            <div className="modal-head">
              <h2>Change Account Password</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <Icons.X />
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-300)', marginBottom: 14 }}>
              Update the individual password for student account <strong>{student.roll} ({student.name})</strong>.
            </p>

            {pwMsg.text && (
              <div
                className={`login-alert ${pwMsg.type === 'error' ? 'login-alert-error' : 'login-alert-success'}`}
                style={{ marginBottom: 14 }}
              >
                <span>{pwMsg.type === 'error' ? '⚠️' : '✓'}</span>
                <span style={{ fontSize: 12.5 }}>{pwMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="curr-pass">Current Password</label>
                <input
                  id="curr-pass"
                  type="password"
                  className="input"
                  required
                  placeholder="Enter current password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="new-pass">New Password</label>
                <input
                  id="new-pass"
                  type="password"
                  className="input"
                  required
                  placeholder="At least 4 characters"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: 18 }}>
                <label htmlFor="conf-pass">Confirm New Password</label>
                <input
                  id="conf-pass"
                  type="password"
                  className="input"
                  required
                  placeholder="Re-type new password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingPw}
                >
                  {savingPw ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
