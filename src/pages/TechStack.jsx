import React, { useState } from 'react';
import { db } from '../data/db';

const schemas = {
  students: `{
  "_id": "ObjectId",
  "name": "String",
  "roll": "String (Unique)",
  "branch": "String",
  "year": "Number",
  "cgpa": "Number",
  "attendance": "Number (0-100)",
  "email": "String (Unique)",
  "password": "String (Salted & Hashed for student sign-in)",
  "status": "String ('active' | 'warning' | 'critical')"
}`,
  classes: `{
  "_id": "ObjectId",
  "subject": "String",
  "code": "String",
  "professor": "String",
  "room": "String",
  "time": "String",
  "day": "String",
  "duration": "Number (minutes)",
  "enrolled": "Number"
}`,
  announcements: `{
  "_id": "ObjectId",
  "title": "String",
  "body": "String",
  "category": "String ('exam' | 'event' | 'facility' | 'placement')",
  "priority": "String ('high' | 'medium' | 'low')",
  "author": "String",
  "date": "ISODate",
  "pinned": "Boolean"
}`
};

export default function TechStack() {
  const [activeTab, setActiveTab] = useState('architecture');
  const [queryCollection, setQueryCollection] = useState('students');
  const [queryFilter, setQueryFilter] = useState('all');
  const [queryResult, setQueryResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runQuery = async (filterKey) => {
    setIsRunning(true);
    let res = [];
    if (queryCollection === 'students') {
      const data = await db.getStudents();
      if (filterKey === 'low-att') {
        res = data.filter(s => s.attendance < 75);
      } else if (filterKey === 'top-cgpa') {
        res = [...data].sort((a, b) => b.cgpa - a.cgpa).slice(0, 3);
      } else {
        res = data;
      }
    } else if (queryCollection === 'classes') {
      res = await db.getClasses();
    } else if (queryCollection === 'announcements') {
      res = await db.getAnnouncements();
    }
    setQueryResult(res);
    setIsRunning(false);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Engineering Project Documentation</h1>
          <p>CS204 Web Technologies & Database Systems · 2nd Year B.Tech Project</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-green" style={{ fontSize: 12 }}>Viva Ready</span>
          <span className="badge badge-sand" style={{ fontSize: 12 }}>Version 1.0.4</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <button
          className={`filter-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          System Architecture
        </button>
        <button
          className={`filter-btn ${activeTab === 'mongo' ? 'active' : ''}`}
          onClick={() => { setActiveTab('mongo'); if (!queryResult) runQuery('all'); }}
        >
          MongoDB Schema & Query Shell
        </button>
        <button
          className={`filter-btn ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Project Specifications & Viva Q&A
        </button>
      </div>

      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tech stack row */}
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🌐</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)' }}>HTML5 & Semantic UI</div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0 }}>
                Accessible DOM hierarchy, semantic containers, ARIA roles, and native form elements for fast rendering.
              </p>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🎨</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)' }}>Vanilla CSS3 Design</div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0 }}>
                Clean CSS custom properties (variables), warm earth-tone palette, fluid flexbox & CSS grid layout. Zero bloated UI libraries.
              </p>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>⚛️</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)' }}>React 19 & ES2024</div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0 }}>
                Functional components, custom state hooks (<code>useState</code>, <code>useEffect</code>), async data flow, and Recharts visualization.
              </p>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🍃</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)' }}>MongoDB Document Model</div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0 }}>
                JSON/BSON collection architecture, atomic updates, projection, aggregation pipelines for attendance & CGPA metrics.
              </p>
            </div>
          </div>

          {/* Architecture diagram card */}
          <div className="card">
            <div className="card-title">Three-Tier Architecture Flow</div>
            <div style={{ background: 'var(--sand-100)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginTop: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div style={{ background: 'white', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Presentation Layer</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, color: 'var(--ink-900)' }}>React 19 SPA</div>
                  <ul style={{ margin: '8px 0 0 16px', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.6 }}>
                    <li>Declarative UI components</li>
                    <li>Client-side route & state management</li>
                    <li>Recharts data visualization</li>
                    <li>Interactive modals & forms</li>
                  </ul>
                </div>

                <div style={{ background: 'white', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application / Data Service</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, color: 'var(--ink-900)' }}>Async REST & CRUD Engine</div>
                  <ul style={{ margin: '8px 0 0 16px', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.6 }}>
                    <li>Promises & Async/Await execution</li>
                    <li>Data sanitization & validation</li>
                    <li>Statistical aggregations</li>
                    <li>Simulated network latencies (200-380ms)</li>
                  </ul>
                </div>

                <div style={{ background: 'white', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Database Layer</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, color: 'var(--ink-900)' }}>MongoDB Collections</div>
                  <ul style={{ margin: '8px 0 0 16px', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.6 }}>
                    <li><code>students</code> (BSON records)</li>
                    <li><code>classes</code> (Timetable slots)</li>
                    <li><code>announcements</code> (Priority feed)</li>
                    <li>Indexed roll numbers & course IDs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mongo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Schema cards */}
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {Object.entries(schemas).map(([name, code]) => (
              <div key={name} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-900)' }}>collection: {name}</span>
                  <span className="badge badge-sand">MongoDB</span>
                </div>
                <pre style={{
                  background: 'var(--sand-100)',
                  border: '1px solid var(--border)',
                  padding: 10,
                  borderRadius: 6,
                  fontSize: 11.5,
                  color: 'var(--ink-700)',
                  overflowX: 'auto',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {code}
                </pre>
              </div>
            ))}
          </div>

          {/* Interactive Query Shell */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Interactive MongoDB Query Runner</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-300)' }}>Live In-Memory Collection Driver</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginBottom: 14 }}>
              Demonstrate live database queries for your presentation panel. Select a collection and preset query filter:
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <select
                className="select"
                value={queryCollection}
                onChange={e => {
                  setQueryCollection(e.target.value);
                  setQueryFilter('all');
                }}
              >
                <option value="students">db.students</option>
                <option value="classes">db.classes</option>
                <option value="announcements">db.announcements</option>
              </select>

              {queryCollection === 'students' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className={`btn ${queryFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setQueryFilter('all'); runQuery('all'); }}
                  >
                    db.students.find()
                  </button>
                  <button
                    className={`btn ${queryFilter === 'low-att' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setQueryFilter('low-att'); runQuery('low-att'); }}
                  >
                    find(&#123; attendance: &#123; $lt: 75 &#125; &#125;)
                  </button>
                  <button
                    className={`btn ${queryFilter === 'top-cgpa' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setQueryFilter('top-cgpa'); runQuery('top-cgpa'); }}
                  >
                    sort(&#123; cgpa: -1 &#125;).limit(3)
                  </button>
                </div>
              )}

              {queryCollection !== 'students' && (
                <button
                  className="btn btn-primary"
                  onClick={() => runQuery('all')}
                >
                  Execute db.{queryCollection}.find()
                </button>
              )}
            </div>

            {/* Query terminal output */}
            <div style={{
              background: '#1a1410',
              color: '#d4c9b8',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              fontFamily: 'monospace',
              fontSize: 12,
              maxHeight: 280,
              overflowY: 'auto',
              border: '1px solid #3d2f23'
            }}>
              <div style={{ color: '#8f7d6b', marginBottom: 8 }}>
                // mongo shell session: campus_db &gt; {queryCollection}.find()
              </div>
              {isRunning ? (
                <div style={{ color: '#c97d3a' }}>Executing query against cluster...</div>
              ) : queryResult ? (
                <pre style={{ margin: 0, color: '#f3efe9', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              ) : (
                <div style={{ color: '#8f7d6b' }}>Click any query button above to inspect live output.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'specs' && (
        <div className="card">
          <div className="card-title">Viva Preparation & Technical Q&A</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink-900)' }}>
                Q1: Why choose MongoDB over traditional SQL (PostgreSQL/MySQL) for this portal?
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 4 }}>
                <strong>Answer:</strong> Academic data models like student profiles frequently evolve with elective subjects, varying semester parameters, and dynamic announcement categories. MongoDB's schema-flexibility allows JSON documents to map directly to client-side JavaScript objects without complicated multi-table JOIN overhead.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink-900)' }}>
                Q2: How is state managed across the different modules?
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 4 }}>
                <strong>Answer:</strong> State is handled through centralized async service helpers that emit promise resolutions to React local states. Actions like registering a new student or adjusting attendance immediately cascade into dashboard KPI totals and alert lists.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink-900)' }}>
                Q3: Why use Vanilla CSS rather than an external UI framework?
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 4 }}>
                <strong>Answer:</strong> Vanilla CSS provides maximum runtime performance with zero external dependency bloat. By establishing a design token system (CSS variables for sand, ink, and accent tokens), the entire application maintains a unified aesthetic without the generic feel of template kits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
