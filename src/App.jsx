import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Results from './pages/Results';
import TechStack from './pages/TechStack';
import Login from './pages/Login';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcampus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('smartcampus_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user session', e);
    }
    setCurrentPage('dashboard');
    showToast(`Signed in as ${user.name}`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('smartcampus_user');
    } catch (e) {
      console.warn('Failed to remove user session', e);
    }
    const name = currentUser?.name || 'User';
    setCurrentUser(null);
    showToast(`Signed out: ${name}`);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('smartcampus_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to update stored session', e);
    }
  };

  // If no user is authenticated, render the dedicated Student / Admin Login Page
  if (!currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} />
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--ink-900)',
            color: 'var(--sand-50)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
            fontWeight: 500,
            boxShadow: 'var(--shadow-md)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            animation: 'fadeUp 0.18s ease'
          }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            <span>{toast}</span>
          </div>
        )}
      </>
    );
  }

  const isStudent = currentUser.role === 'student';

  const navItems = isStudent
    ? [
        { id: 'dashboard',     label: 'My Portal',     icon: Icons.Dashboard },
        { id: 'classes',       label: 'Timetable',     icon: Icons.Classes },
        { id: 'results',       label: 'Results & Rank',icon: Icons.Results },
        { id: 'announcements', label: 'Notices',       icon: Icons.Announcements },
        { id: 'students',      label: 'Directory',     icon: Icons.Students },
        { id: 'tech',          label: 'Project & Mongo',icon: Icons.TechStack },
      ]
    : [
        { id: 'dashboard',     label: 'Dashboard',     icon: Icons.Dashboard },
        { id: 'students',      label: 'Students',      icon: Icons.Students },
        { id: 'attendance',    label: 'Attendance',    icon: Icons.Attendance },
        { id: 'classes',       label: 'Timetable',     icon: Icons.Classes },
        { id: 'results',       label: 'Results & CGPA',icon: Icons.Results },
        { id: 'announcements', label: 'Notices',       icon: Icons.Announcements },
        { id: 'tech',          label: 'Project & Mongo',icon: Icons.TechStack },
      ];

  const getPageTitle = () => {
    if (currentPage === 'dashboard' && isStudent) return `Student Portal · ${currentUser.name}`;
    const item = navItems.find(n => n.id === currentPage);
    return item ? item.label : 'SmartCampus';
  };

  const userInitials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'var(--accent)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14
            }}>
              C
            </div>
            <div>
              <div className="brand-name">CampusPortal</div>
              <div className="brand-sub">Academic Information System</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">
            {isStudent ? 'Student Account' : 'Academics & Management'}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ padding: '12px 14px', marginTop: 8 }}>
          <div style={{
            background: 'var(--sand-50)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px'
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', textTransform: 'uppercase' }}>
              {isStudent ? 'Authenticated Student' : 'College Project'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-700)', fontWeight: 500, marginTop: 2 }}>
              {isStudent ? `${currentUser.branch || 'Computer Sci.'}` : 'Dept. of Computer Sci.'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-300)', marginTop: 2 }}>
              {isStudent ? `Roll: ${currentUser.roll} · Year ${currentUser.year || 3}` : 'Semester 4 Viva · 2026'}
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Logged In User & Sign Out */}
        <div className="sidebar-footer">
          <div className="user-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="user-avatar" style={{
              background: isStudent ? 'var(--accent-light)' : 'var(--sand-300)',
              color: isStudent ? 'var(--accent)' : 'var(--ink-900)',
              fontWeight: 700
            }}>
              {userInitials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </div>
              <div className="user-role">
                {isStudent ? `Student · ${currentUser.roll}` : 'Administrator'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="topbar-btn"
              style={{ padding: '4px 6px', color: 'var(--red)', border: 'none', background: 'transparent' }}
              title="Sign Out"
              id="sidebar-btn-logout"
            >
              <Icons.LogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="topbar-title">{getPageTitle()}</span>
            <span style={{ color: 'var(--ink-200)', fontSize: 13 }}>/</span>
            <span style={{ fontSize: 12.5, color: 'var(--ink-300)' }}>
              {isStudent ? `${currentUser.branch || 'Computer Sci.'} Dept.` : 'Department of CS & IT'}
            </span>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              <Icons.Search />
              <input
                type="text"
                placeholder="Press / to search..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    showToast(`Searching for "${e.currentTarget.value}"...`);
                    setCurrentPage('students');
                  }
                }}
              />
            </div>

            {/* Account pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              fontSize: 12,
              color: 'var(--ink-700)'
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
              <span>{currentUser.name}</span>
              <span className="badge badge-sand" style={{ fontSize: 10, padding: '1px 5px' }}>
                {isStudent ? currentUser.roll : 'ADMIN'}
              </span>
            </div>

            <button
              className="topbar-btn"
              onClick={handleLogout}
              title="Sign Out"
              id="topbar-btn-logout"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-700)' }}
            >
              <Icons.LogOut />
              <span>Sign Out</span>
            </button>

            <button
              className="topbar-btn"
              onClick={() => showToast('System in sync with MongoDB local cluster')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3a7c52' }}/>
              <span style={{ fontSize: 11.5 }}>{currentTime || 'Online'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic page content */}
        <main>
          {currentPage === 'dashboard' && (
            isStudent ? (
              <StudentDashboard
                student={currentUser}
                onNavigate={(page) => setCurrentPage(page)}
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <Dashboard />
            )
          )}
          {currentPage === 'students'      && <Students />}
          {currentPage === 'attendance'    && <Attendance />}
          {currentPage === 'classes'       && <Classes />}
          {currentPage === 'results'       && <Results />}
          {currentPage === 'announcements' && <Announcements />}
          {currentPage === 'tech'          && <TechStack />}
        </main>
      </div>

      {/* Human Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--ink-900)',
          color: 'var(--sand-50)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: 'var(--shadow-md)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeUp 0.18s ease'
        }}>
          <span style={{ color: 'var(--accent)' }}>●</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
