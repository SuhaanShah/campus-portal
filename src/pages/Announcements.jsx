import React, { useEffect, useState } from 'react';
import { db } from '../data/db';

const catStyle = {
  exam:      { cls: 'badge-red',    label: 'Exam'      },
  event:     { cls: 'badge-blue',   label: 'Event'     },
  facility:  { cls: 'badge-sand',   label: 'Facility'  },
  placement: { cls: 'badge-green',  label: 'Placement' },
};

const priorityDot = {
  high:   { bg: '#c0392b', title: 'High priority'   },
  medium: { bg: '#b07d1a', title: 'Medium priority' },
  low:    { bg: '#3a7c52', title: 'Low priority'    },
};

export default function Announcements() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]       = useState('all');

  useEffect(() => {
    db.getAnnouncements().then(d => { setItems(d); setLoading(false); });
  }, []);

  const cats = ['all', 'exam', 'event', 'facility', 'placement'];
  const visible = cat === 'all' ? items : items.filter(a => a.category === cat);

  const pinned  = visible.filter(a => a.pinned);
  const regular = visible.filter(a => !a.pinned);

  return (
    <div className="page">
      <div className="page-head fade-up">
        <div>
          <h1>Announcements</h1>
          <p>Collection: <code>announcements</code> · {items.length} documents</p>
        </div>
        <button className="btn btn-primary" id="btn-new-announcement">Post announcement</button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }} className="fade-up-1">
        {cats.map(c => (
          <button
            key={c}
            id={`cat-${c}`}
            onClick={() => setCat(c)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: cat === c ? 'var(--ink-900)' : 'var(--border)',
              background: cat === c ? 'var(--ink-900)' : 'white',
              color: cat === c ? 'white' : 'var(--ink-500)',
              fontSize: 12.5,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.12s',
              textTransform: 'capitalize',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-wrap fade-up-2"><div className="spinner"/> Loading announcements…</div>
      ) : (
        <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Pinned */}
          {pinned.map(a => (
            <div key={a._id} className="card" style={{ borderLeft: '3px solid var(--accent)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>📌 Pinned</span>
              </div>
              <AnnouncementBody a={a}/>
            </div>
          ))}

          {/* Regular */}
          {regular.map(a => (
            <div key={a._id} className="card">
              <AnnouncementBody a={a}/>
            </div>
          ))}

          {visible.length === 0 && <div className="empty"><p>No announcements in this category.</p></div>}
        </div>
      )}
    </div>
  );
}

function AnnouncementBody({ a }) {
  const [open, setOpen] = useState(false);
  const cs = catStyle[a.category] || { cls: 'badge-sand', label: a.category };
  const pd = priorityDot[a.priority];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
        <span className={`badge ${cs.cls}`}>{cs.label}</span>
        <div title={pd?.title} style={{ width: 7, height: 7, borderRadius: '50%', background: pd?.bg, marginTop: 5, flexShrink: 0 }}/>
        <span style={{ fontSize: 12, color: 'var(--ink-300)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink-900)', marginBottom: 5, lineHeight: 1.35 }}>{a.title}</div>
      <p style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.65, display: open ? 'block' : '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: open ? 'visible' : 'hidden' }}>
        {a.body}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-300)' }}>— {a.author}</span>
        <button id={`ann-toggle-${a._id}`} onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
          {open ? 'Show less' : 'Read more'}
        </button>
      </div>
    </div>
  );
}
