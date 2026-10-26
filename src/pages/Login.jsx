import React, { useState } from 'react';
import { db } from '../data/db';
import { Icons } from '../Icons';

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('CS21001');
  const [password, setPassword] = useState('arjun@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: '',
    roll: '',
    branch: 'Computer Sci.',
    year: '2',
    email: '',
    password: '',
    confirmPassword: '',
    cgpa: '8.5',
    attendance: '90',
  });

  const demoCredentials = db.getDemoCredentials();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await db.authenticateUser(identifier, password);
      if (result.success) {
        setSuccessMsg(`Welcome, ${result.user.name}! Logging you into your portal...`);
        setTimeout(() => {
          onLogin(result.user);
        }, 500);
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (regForm.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const result = await db.registerStudent({
        name: regForm.name,
        roll: regForm.roll,
        branch: regForm.branch,
        year: regForm.year,
        email: regForm.email,
        password: regForm.password,
        cgpa: regForm.cgpa,
        attendance: regForm.attendance,
      });

      if (result.success) {
        setSuccessMsg(`Account created for ${result.user.name} (${result.user.roll})! Logging in...`);
        setTimeout(() => {
          onLogin(result.user);
        }, 600);
      } else {
        setErrorMsg(result.error || 'Could not register account.');
      }
    } catch (err) {
      setErrorMsg('Registration failed. Please check input values.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickCreds = (cred, forceWrong = false) => {
    setActiveTab('login');
    setIdentifier(cred.roll === 'ADMIN' ? cred.email : cred.roll);
    setPassword(forceWrong ? 'wrongpassword999' : cred.pass);
    setErrorMsg('');
    setSuccessMsg(forceWrong ? 'Entered deliberate wrong password to test rejection.' : `Loaded credentials for ${cred.name}`);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container fade-up">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-logo">
            <span>C</span>
          </div>
          <h1 className="login-title">CampusPortal</h1>
          <p className="login-subtitle">Academic Information & Student Authentication System</p>
          <div className="login-badge-pill">
            <Icons.Shield />
            <span>Secure Student Authentication · MongoDB Powered</span>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            <Icons.Lock />
            <span>Student Sign In</span>
          </button>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            <Icons.Plus />
            <span>New Student Account</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="login-alert login-alert-error fade-up">
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.4 }}>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="login-alert login-alert-success fade-up">
            <Icons.Check />
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.4 }}>{successMsg}</div>
          </div>
        )}

        {/* Form: Sign In */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="field">
              <label htmlFor="login-id">Roll Number or University Email</label>
              <div className="input-group">
                <input
                  id="login-id"
                  className="input"
                  type="text"
                  required
                  placeholder="e.g. CS21001 or arjun@campus.edu"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <span className="input-help">Case-insensitive. Matches college student registry.</span>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-password">Individual Password</label>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5 }}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="input-group" style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your student password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <span className="input-help">Strict credential check: only logs in with the matching password.</span>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: 20, padding: '10px 16px', fontSize: 14 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Icons.Lock />
                  <span>Sign Into Student Portal</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Form: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="field">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  className="input"
                  required
                  placeholder="e.g. Rohan Das"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="reg-roll">Roll Number</label>
                <input
                  id="reg-roll"
                  className="input"
                  required
                  placeholder="e.g. CS21010"
                  value={regForm.roll}
                  onChange={(e) => setRegForm({ ...regForm, roll: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
              <div className="field">
                <label htmlFor="reg-branch">Branch</label>
                <select
                  id="reg-branch"
                  className="input"
                  value={regForm.branch}
                  onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                >
                  <option>Computer Sci.</option>
                  <option>Electronics</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                  <option>Information Tech</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="reg-year">Year</label>
                <select
                  id="reg-year"
                  className="input"
                  value={regForm.year}
                  onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label htmlFor="reg-email">University Email</label>
              <input
                id="reg-email"
                className="input"
                type="email"
                required
                placeholder="rohan@campus.edu"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              />
            </div>

            <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
              <div className="field">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  className="input"
                  type="password"
                  required
                  placeholder="At least 4 chars"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <input
                  id="reg-confirm"
                  className="input"
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-register-submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: 20, padding: '10px 16px', fontSize: 14 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Icons.Plus />
                  <span>Create Account & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Credentials Quick-Fill helper for Viva / Evaluation */}
        <div className="demo-credentials-card">
          <div className="demo-cred-header">
            <span style={{ fontWeight: 600, color: 'var(--ink-700)', fontSize: 12 }}>
              ⚡ Quick-Fill Accounts for Demo & Viva Testing:
            </span>
            <span style={{ fontSize: 11, color: 'var(--ink-300)' }}>Click any to autofill</span>
          </div>

          <div className="demo-cred-chips">
            {demoCredentials.map((cred) => (
              <button
                key={cred.roll}
                type="button"
                className="demo-chip"
                onClick={() => setQuickCreds(cred, false)}
                title={`Roll: ${cred.roll} | Pass: ${cred.pass}`}
              >
                <span className="demo-chip-name">{cred.name}</span>
                <span className="demo-chip-cred">({cred.roll} · {cred.pass})</span>
              </button>
            ))}

            <button
              type="button"
              className="demo-chip demo-chip-test-wrong"
              onClick={() => {
                const sample = demoCredentials[0];
                setQuickCreds(sample, true);
              }}
              title="Test entering an incorrect password"
            >
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>Test Wrong Password (CS21001)</span>
            </button>
          </div>
        </div>

        <div className="login-footer">
          <span>CampusPortal v2.6 · College Project CS/IT · MongoDB & React</span>
        </div>
      </div>
    </div>
  );
}
