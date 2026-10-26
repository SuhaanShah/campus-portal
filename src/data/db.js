// SmartCampus Data Service
// Connects to Node.js + Express + MongoDB backend API (/api)
// with intelligent local fallback for development/offline resilience.

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ── Default Mock Records (Used when backend is offline) ─────────
const initialStudents = [
  { _id: 's01', name: 'Arjun Sharma',   roll: 'CS21001', branch: 'Computer Sci.', year: 3, cgpa: 8.9, attendance: 92, email: 'arjun@campus.edu',   password: 'arjun@123', status: 'active'   },
  { _id: 's02', name: 'Priya Nair',     roll: 'CS21002', branch: 'Computer Sci.', year: 3, cgpa: 9.4, attendance: 97, email: 'priya@campus.edu',   password: 'priya@123', status: 'active'   },
  { _id: 's03', name: 'Rahul Mehta',    roll: 'EC21003', branch: 'Electronics',   year: 2, cgpa: 7.8, attendance: 74, email: 'rahul@campus.edu',   password: 'rahul@123', status: 'warning'  },
  { _id: 's04', name: 'Sneha Patel',    roll: 'ME21004', branch: 'Mechanical',    year: 2, cgpa: 8.2, attendance: 88, email: 'sneha@campus.edu',   password: 'sneha@123', status: 'active'   },
  { _id: 's05', name: 'Vikram Singh',   roll: 'CS21005', branch: 'Computer Sci.', year: 4, cgpa: 9.1, attendance: 95, email: 'vikram@campus.edu',  password: 'vikram@123', status: 'active'   },
  { _id: 's06', name: 'Ananya Roy',     roll: 'CE21006', branch: 'Civil',         year: 1, cgpa: 7.3, attendance: 68, email: 'ananya@campus.edu',  password: 'ananya@123', status: 'critical' },
  { _id: 's07', name: 'Karan Joshi',    roll: 'EC21007', branch: 'Electronics',   year: 3, cgpa: 8.6, attendance: 91, email: 'karan@campus.edu',   password: 'karan@123', status: 'active'   },
  { _id: 's08', name: 'Meera Iyer',     roll: 'CS21008', branch: 'Computer Sci.', year: 2, cgpa: 9.7, attendance: 98, email: 'meera@campus.edu',   password: 'meera@123', status: 'active'   },
];

const fallbackClasses = [
  { _id: 'c01', subject: 'Data Structures & Algorithms', code: 'CS301', professor: 'Dr. A. Krishnan', room: 'LH-204', time: '09:00', day: 'Monday',    duration: 60,  enrolled: 64 },
  { _id: 'c02', subject: 'Database Management Systems',  code: 'CS302', professor: 'Dr. R. Sharma',   room: 'LH-101', time: '10:30', day: 'Tuesday',   duration: 90,  enrolled: 58 },
  { _id: 'c03', subject: 'Operating Systems',            code: 'CS303', professor: 'Prof. M. Verma',  room: 'Lab-3',   time: '14:00', day: 'Wednesday', duration: 120, enrolled: 52 },
  { _id: 'c04', subject: 'Computer Networks',            code: 'CS304', professor: 'Dr. P. Gupta',    room: 'LH-205', time: '11:00', day: 'Thursday',  duration: 60,  enrolled: 61 },
  { _id: 'c05', subject: 'Machine Learning',             code: 'CS401', professor: 'Dr. S. Kumar',    room: 'Lab-7',   time: '15:30', day: 'Friday',    duration: 90,  enrolled: 48 },
  { _id: 'c06', subject: 'Web Technologies',             code: 'CS305', professor: 'Prof. L. Das',    room: 'Lab-2',   time: '08:30', day: 'Monday',    duration: 90,  enrolled: 55 },
];

const fallbackAnnouncements = [
  { _id: 'a01', title: 'Mid-Semester Exam Schedule Released', body: 'Mid-sem exams start November 10. Students must carry their hall tickets. No electronic devices are allowed inside the hall.', category: 'exam',      priority: 'high',   author: 'Academic Office',  date: '2026-10-24', pinned: true  },
  { _id: 'a02', title: 'TechFest 2026 — Registrations Open',  body: 'Annual TechFest registrations are open. Participate in hackathons, robotics, and paper presentations. Deadline: November 5.', category: 'event',     priority: 'medium', author: 'Student Council',  date: '2026-10-22', pinned: true  },
  { _id: 'a03', title: 'Library Extended Hours During Exams',  body: 'Library will be open 24×7 from November 8–20. Students need to swipe their ID cards after 10 PM.', category: 'facility',  priority: 'low',    author: 'Library',          date: '2026-10-21', pinned: false },
  { _id: 'a04', title: 'Campus Placement — TCS & Infosys',     body: 'TCS and Infosys will visit for final year placements on November 15–16. Register on the placement portal by November 1.', category: 'placement', priority: 'high',   author: 'Placement Cell',   date: '2026-10-20', pinned: false },
  { _id: 'a05', title: 'Sports Complex Renovation Notice',     body: 'Sports complex is under renovation from October 28 – November 7. Cricket and football grounds remain accessible.', category: 'facility',  priority: 'low',    author: 'Admin',            date: '2026-10-19', pinned: false },
];

// LocalStorage helpers for offline resilience
function loadLocalStudents() {
  try {
    const saved = localStorage.getItem('smartcampus_students_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Could not read from localStorage', err);
  }
  return initialStudents;
}

function saveLocalStudents(data) {
  try {
    localStorage.setItem('smartcampus_students_db', JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
}

let localStudents = loadLocalStudents();

// ── Exported API ────────────────────────────────────────────────
export const db = {
  // Check health of backend API & MongoDB
  checkBackendHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend offline
    }
    return { status: 'offline', database: 'disconnected' };
  },

  // READ Students
  getStudents: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/students`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveLocalStudents(data);
          localStudents = data;
          return data;
        }
      }
    } catch (err) {
      console.info('Using local cache for students (API server not reached)', err.message);
    }
    await wait(200);
    return [...localStudents];
  },

  // READ Classes
  getClasses: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/classes`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.info('Using fallback classes', err.message);
    }
    await wait(200);
    return [...fallbackClasses];
  },

  // READ Announcements
  getAnnouncements: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.info('Using fallback announcements', err.message);
    }
    await wait(200);
    return [...fallbackAnnouncements].sort((a,b) => b.pinned - a.pinned);
  },

  // READ Attendance Trend
  getAttendanceTrend: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance-trend`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    await wait(200);
    return [
      { month: 'Jul', CS: 94, EC: 89, ME: 85, CE: 91 },
      { month: 'Aug', CS: 91, EC: 87, ME: 82, CE: 88 },
      { month: 'Sep', CS: 88, EC: 84, ME: 79, CE: 85 },
      { month: 'Oct', CS: 93, EC: 90, ME: 86, CE: 89 },
    ];
  },

  // READ Semester Results
  getSemResults: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sem-results`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    await wait(200);
    return [
      { sem: 'Sem 1', avg: 7.8 },
      { sem: 'Sem 2', avg: 8.1 },
      { sem: 'Sem 3', avg: 8.4 },
      { sem: 'Sem 4', avg: 8.7 },
      { sem: 'Sem 5', avg: 8.9 },
    ];
  },

  // READ Dashboard KPI Stats
  getDashboardStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    await wait(250);
    return {
      totalStudents: localStudents.length,
      totalClasses:  fallbackClasses.length,
      avgAttendance: Math.round(localStudents.reduce((a, s) => a + (s.attendance || 0), 0) / localStudents.length),
      avgCgpa:       (localStudents.reduce((a, s) => a + (s.cgpa || 0), 0) / localStudents.length).toFixed(2),
      lowAttendance: localStudents.filter(s => (s.attendance || 0) < 75).length,
      highPriorityAnnouncements: fallbackAnnouncements.filter(a => a.priority === 'high').length,
    };
  },

  // AUTH: Student & Admin login with MongoDB API
  authenticateUser: async (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) return { success: false, error: 'Please enter your Roll Number or University Email.' };
    if (!cleanPass) return { success: false, error: 'Please enter your account password.' };

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: cleanPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      if (!res.ok && data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Backend login request error, checking local storage cache...', err.message);
    }

    // Offline / Local Storage Fallback
    await wait(250);
    if (cleanId === 'admin' || cleanId === 'admin@campus.edu') {
      if (cleanPass === 'admin@123') {
        return {
          success: true,
          user: {
            _id: 'adm01',
            name: 'Suhaan A.',
            email: 'admin@campus.edu',
            role: 'admin',
            title: 'Head of Student Affairs · CS Dept.',
            avatar: 'SA',
          }
        };
      }
      return { success: false, error: 'Incorrect admin password. (Hint: default is admin@123)' };
    }

    const student = localStudents.find(s =>
      s.roll.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId
    );

    if (!student) {
      return {
        success: false,
        error: `No student record found for "${identifier}". Please check your Roll Number / Email or create an account.`
      };
    }

    const studentPass = student.password || `${student.name.split(' ')[0].toLowerCase()}@123`;
    if (studentPass !== cleanPass) {
      return {
        success: false,
        error: `Incorrect password for ${student.name} (${student.roll}). Please enter the correct password.`
      };
    }

    return {
      success: true,
      user: {
        ...student,
        role: 'student'
      }
    };
  },

  // REGISTER: Student self-registration with MongoDB API
  registerStudent: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Also update local cache
        localStudents.push(result.user);
        saveLocalStudents(localStudents);
        return result;
      }
      if (result.error) {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.warn('Backend register request failed, falling back to local storage', err.message);
    }

    // Offline Fallback
    await wait(300);
    const roll = (data.roll || '').trim().toUpperCase();
    const email = (data.email || '').trim().toLowerCase();

    if (localStudents.some(s => s.roll.toUpperCase() === roll)) {
      return { success: false, error: `Roll number ${roll} is already registered.` };
    }
    if (localStudents.some(s => s.email.toLowerCase() === email)) {
      return { success: false, error: `Email address ${email} is already in use.` };
    }

    const doc = {
      _id: `s${Date.now()}`,
      name: data.name.trim(),
      roll: roll,
      branch: data.branch || 'Computer Sci.',
      year: parseInt(data.year, 10) || 1,
      cgpa: parseFloat(data.cgpa) || 8.0,
      attendance: parseInt(data.attendance, 10) || 85,
      email: email,
      password: data.password || 'student@123',
      status: 'active',
    };

    localStudents.push(doc);
    saveLocalStudents(localStudents);

    return {
      success: true,
      user: {
        ...doc,
        role: 'student'
      }
    };
  },

  // CHANGE PASSWORD
  changePassword: async (studentId, currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, currentPassword, newPassword }),
      });
      const result = await res.json();
      if (res.ok && result.success) return result;
      if (result.error) return { success: false, error: result.error };
    } catch (err) {
      console.warn('Backend password change failed, falling back to local cache', err.message);
    }

    // Offline fallback
    await wait(200);
    const i = localStudents.findIndex(s => s._id === studentId);
    if (i === -1) return { success: false, error: 'Student account not found.' };

    const currentActual = localStudents[i].password || `${localStudents[i].name.split(' ')[0].toLowerCase()}@123`;
    if (currentActual !== currentPassword) {
      return { success: false, error: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters.' };
    }

    localStudents[i].password = newPassword;
    saveLocalStudents(localStudents);
    return { success: true, message: 'Password updated successfully!' };
  },

  // GET DEMO CREDENTIALS: Quick reference for viva/presentation
  getDemoCredentials: () => {
    return [
      { name: 'Arjun Sharma', roll: 'CS21001', email: 'arjun@campus.edu', pass: 'arjun@123', branch: 'Computer Sci.', year: 3, role: 'student' },
      { name: 'Priya Nair',   roll: 'CS21002', email: 'priya@campus.edu', pass: 'priya@123', branch: 'Computer Sci.', year: 3, role: 'student' },
      { name: 'Rahul Mehta',  roll: 'EC21003', email: 'rahul@campus.edu', pass: 'rahul@123', branch: 'Electronics',   year: 2, role: 'student' },
      { name: 'Sneha Patel',  roll: 'ME21004', email: 'sneha@campus.edu', pass: 'sneha@123', branch: 'Mechanical',    year: 2, role: 'student' },
      { name: 'Administrator', roll: 'ADMIN', email: 'admin@campus.edu', pass: 'admin@123', branch: 'CS Admin',     year: '-', role: 'admin' },
    ];
  },

  // INSERT (Add Student)
  addStudent: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const doc = await res.json();
        localStudents.push(doc);
        saveLocalStudents(localStudents);
        return doc;
      }
    } catch (err) {
      console.warn('Backend add student failed, saving locally', err.message);
    }

    await wait(250);
    const doc = {
      ...data,
      _id: `s${Date.now()}`,
      status: 'active',
      attendance: parseInt(data.attendance, 10) || 85,
      cgpa: parseFloat(data.cgpa) || 8.0,
      year: parseInt(data.year, 10) || 1,
      password: data.password || 'student@123',
    };
    localStudents.push(doc);
    saveLocalStudents(localStudents);
    return doc;
  },

  // UPDATE (Mark Attendance)
  markAttendance: async (id, delta) => {
    try {
      const res = await fetch(`${API_BASE}/api/students/${id}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      if (res.ok) {
        const updated = await res.json();
        const i = localStudents.findIndex(s => s._id === id);
        if (i !== -1) localStudents[i] = updated;
        saveLocalStudents(localStudents);
        return updated;
      }
    } catch (err) {
      console.warn('Backend mark attendance failed, updating locally', err.message);
    }

    await wait(180);
    const i = localStudents.findIndex(s => s._id === id);
    if (i === -1) return null;
    localStudents[i].attendance = Math.max(0, Math.min(100, (localStudents[i].attendance || 0) + delta));
    localStudents[i].status =
      localStudents[i].attendance >= 85 ? 'active' :
      localStudents[i].attendance >= 75 ? 'warning' : 'critical';
    saveLocalStudents(localStudents);
    return { ...localStudents[i] };
  },
};
