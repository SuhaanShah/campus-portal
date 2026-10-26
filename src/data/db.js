// SmartCampus High-Performance Local-First Data Engine
// Designed for reliable, instant laptop presentation to evaluators & teachers.
// Uses reactive browser persistence (localStorage) with instant zero-latency responses.

const STORAGE_KEYS = {
  STUDENTS: 'smartcampus_students_db_v2',
  CLASSES: 'smartcampus_classes_db_v2',
  ANNOUNCEMENTS: 'smartcampus_announcements_db_v2',
};

// ── Default Rich Seed Records ─────────────────────────────────
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

const initialClasses = [
  { _id: 'c01', subject: 'Data Structures & Algorithms', code: 'CS301', professor: 'Dr. A. Krishnan', room: 'LH-204', time: '09:00', day: 'Monday',    duration: 60,  enrolled: 64 },
  { _id: 'c02', subject: 'Database Management Systems',  code: 'CS302', professor: 'Dr. R. Sharma',   room: 'LH-101', time: '10:30', day: 'Tuesday',   duration: 90,  enrolled: 58 },
  { _id: 'c03', subject: 'Operating Systems',            code: 'CS303', professor: 'Prof. M. Verma',  room: 'Lab-3',   time: '14:00', day: 'Wednesday', duration: 120, enrolled: 52 },
  { _id: 'c04', subject: 'Computer Networks',            code: 'CS304', professor: 'Dr. P. Gupta',    room: 'LH-205', time: '11:00', day: 'Thursday',  duration: 60,  enrolled: 61 },
  { _id: 'c05', subject: 'Machine Learning',             code: 'CS401', professor: 'Dr. S. Kumar',    room: 'Lab-7',   time: '15:30', day: 'Friday',    duration: 90,  enrolled: 48 },
  { _id: 'c06', subject: 'Web Technologies',             code: 'CS305', professor: 'Prof. L. Das',    room: 'Lab-2',   time: '08:30', day: 'Monday',    duration: 90,  enrolled: 55 },
];

const initialAnnouncements = [
  { _id: 'a01', title: 'Mid-Semester Exam Schedule Released', body: 'Mid-sem exams start November 10. Students must carry their hall tickets. No electronic devices are allowed inside the hall.', category: 'exam',      priority: 'high',   author: 'Academic Office',  date: '2026-10-24', pinned: true  },
  { _id: 'a02', title: 'TechFest 2026 — Registrations Open',  body: 'Annual TechFest registrations are open. Participate in hackathons, robotics, and paper presentations. Deadline: November 5.', category: 'event',     priority: 'medium', author: 'Student Council',  date: '2026-10-22', pinned: true  },
  { _id: 'a03', title: 'Library Extended Hours During Exams',  body: 'Library will be open 24×7 from November 8–20. Students need to swipe their ID cards after 10 PM.', category: 'facility',  priority: 'low',    author: 'Library',          date: '2026-10-21', pinned: false },
  { _id: 'a04', title: 'Campus Placement — TCS & Infosys',     body: 'TCS and Infosys will visit for final year placements on November 15–16. Register on the placement portal by November 1.', category: 'placement', priority: 'high',   author: 'Placement Cell',   date: '2026-10-20', pinned: false },
  { _id: 'a05', title: 'Sports Complex Renovation Notice',     body: 'Sports complex is under renovation from October 28 – November 7. Cricket and football grounds remain accessible.', category: 'facility',  priority: 'low',    author: 'Admin',            date: '2026-10-19', pinned: false },
];

const attendanceTrendData = [
  { month: 'Jul', CS: 94, EC: 89, ME: 85, CE: 91 },
  { month: 'Aug', CS: 91, EC: 87, ME: 82, CE: 88 },
  { month: 'Sep', CS: 88, EC: 84, ME: 79, CE: 85 },
  { month: 'Oct', CS: 93, EC: 90, ME: 86, CE: 89 },
];

const semResultsData = [
  { sem: 'Sem 1', avg: 7.8 },
  { sem: 'Sem 2', avg: 8.1 },
  { sem: 'Sem 3', avg: 8.4 },
  { sem: 'Sem 4', avg: 8.7 },
  { sem: 'Sem 5', avg: 8.9 },
];

// Helper to safely load from localStorage
function getStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn(`Error reading ${key}`, e);
  }
  return fallback;
}

function setStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving ${key}`, e);
  }
}

// In-memory cache synced with localStorage
let studentsStore = getStore(STORAGE_KEYS.STUDENTS, initialStudents);
let classesStore = getStore(STORAGE_KEYS.CLASSES, initialClasses);
let announcementsStore = getStore(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);

// Save initial data if not already present
setStore(STORAGE_KEYS.STUDENTS, studentsStore);
setStore(STORAGE_KEYS.CLASSES, classesStore);
setStore(STORAGE_KEYS.ANNOUNCEMENTS, announcementsStore);

export const db = {
  // Health status
  checkBackendHealth: async () => {
    return {
      status: 'ok',
      database: 'connected (Local Engine)',
      timestamp: new Date().toISOString()
    };
  },

  // READ Students
  getStudents: async () => {
    return [...studentsStore];
  },

  // READ Classes
  getClasses: async () => {
    return [...classesStore];
  },

  // READ Announcements
  getAnnouncements: async () => {
    return [...announcementsStore].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  },

  // READ Attendance Trend
  getAttendanceTrend: async () => {
    return [...attendanceTrendData];
  },

  // READ Semester Results
  getSemResults: async () => {
    return [...semResultsData];
  },

  // READ Dashboard Stats (Computed dynamically from real stored records)
  getDashboardStats: async () => {
    const totalStudents = studentsStore.length;
    const totalClasses = classesStore.length;
    const avgAttendance = totalStudents > 0
      ? Math.round(studentsStore.reduce((acc, s) => acc + (s.attendance || 0), 0) / totalStudents)
      : 0;
    const avgCgpa = totalStudents > 0
      ? (studentsStore.reduce((acc, s) => acc + (s.cgpa || 0), 0) / totalStudents).toFixed(2)
      : '0.00';
    const lowAttendance = studentsStore.filter(s => (s.attendance || 0) < 75).length;
    const highPriorityAnnouncements = announcementsStore.filter(a => a.priority === 'high').length;

    return {
      totalStudents,
      totalClasses,
      avgAttendance,
      avgCgpa,
      lowAttendance,
      highPriorityAnnouncements,
    };
  },

  // AUTH: Authenticate user (Admin or Student)
  authenticateUser: async (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) return { success: false, error: 'Please enter your Roll Number or University Email.' };
    if (!cleanPass) return { success: false, error: 'Please enter your account password.' };

    // 1. Admin login check
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

    // 2. Student login check
    const student = studentsStore.find(s =>
      (s.roll && s.roll.toLowerCase() === cleanId) ||
      (s.email && s.email.toLowerCase() === cleanId)
    );

    if (!student) {
      return {
        success: false,
        error: `No student record found for "${identifier}". Please check your Roll Number / Email or create an account.`
      };
    }

    const expectedPass = student.password || `${student.name.split(' ')[0].toLowerCase()}@123`;
    if (expectedPass !== cleanPass) {
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

  // REGISTER: Student Registration
  registerStudent: async (data) => {
    const roll = (data.roll || '').trim().toUpperCase();
    const email = (data.email || '').trim().toLowerCase();
    const name = (data.name || '').trim();

    if (!name || !roll || !email) {
      return { success: false, error: 'Name, Roll Number, and Email are required.' };
    }

    if (studentsStore.some(s => s.roll.toUpperCase() === roll)) {
      return { success: false, error: `Roll number ${roll} is already registered.` };
    }
    if (studentsStore.some(s => s.email.toLowerCase() === email)) {
      return { success: false, error: `Email address ${email} is already in use.` };
    }

    const doc = {
      _id: `s${Date.now()}`,
      name: name,
      roll: roll,
      branch: data.branch || 'Computer Sci.',
      year: parseInt(data.year, 10) || 1,
      cgpa: parseFloat(data.cgpa) || 8.0,
      attendance: parseInt(data.attendance, 10) || 85,
      email: email,
      password: data.password || 'student@123',
      status: (parseInt(data.attendance, 10) || 85) >= 85 ? 'active' : (parseInt(data.attendance, 10) || 85) >= 75 ? 'warning' : 'critical',
    };

    studentsStore = [doc, ...studentsStore];
    setStore(STORAGE_KEYS.STUDENTS, studentsStore);

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
    const i = studentsStore.findIndex(s => s._id === studentId);
    if (i === -1) return { success: false, error: 'Student account not found.' };

    const currentActual = studentsStore[i].password || `${studentsStore[i].name.split(' ')[0].toLowerCase()}@123`;
    if (currentActual !== currentPassword) {
      return { success: false, error: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters.' };
    }

    studentsStore[i].password = newPassword;
    setStore(STORAGE_KEYS.STUDENTS, studentsStore);
    return { success: true, message: 'Password updated successfully!' };
  },

  // GET DEMO CREDENTIALS: Quick 1-click viva/presentation accounts
  getDemoCredentials: () => {
    return [
      { name: 'Arjun Sharma', roll: 'CS21001', email: 'arjun@campus.edu', pass: 'arjun@123', branch: 'Computer Sci.', year: 3, role: 'student' },
      { name: 'Priya Nair',   roll: 'CS21002', email: 'priya@campus.edu', pass: 'priya@123', branch: 'Computer Sci.', year: 3, role: 'student' },
      { name: 'Rahul Mehta',  roll: 'EC21003', email: 'rahul@campus.edu', pass: 'rahul@123', branch: 'Electronics',   year: 2, role: 'student' },
      { name: 'Sneha Patel',  roll: 'ME21004', email: 'sneha@campus.edu', pass: 'sneha@123', branch: 'Mechanical',    year: 2, role: 'student' },
      { name: 'Administrator', roll: 'ADMIN', email: 'admin@campus.edu', pass: 'admin@123', branch: 'CS Admin',     year: '-', role: 'admin' },
    ];
  },

  // INSERT: Add Student
  addStudent: async (data) => {
    const att = parseInt(data.attendance, 10) || 85;
    const doc = {
      _id: `s${Date.now()}`,
      name: data.name ? data.name.trim() : 'New Student',
      roll: data.roll ? data.roll.trim().toUpperCase() : `CS${Date.now().toString().slice(-4)}`,
      branch: data.branch || 'Computer Sci.',
      year: parseInt(data.year, 10) || 1,
      cgpa: parseFloat(data.cgpa) || 8.0,
      attendance: att,
      email: data.email ? data.email.trim().toLowerCase() : `student${Date.now().toString().slice(-3)}@campus.edu`,
      password: data.password || 'student@123',
      status: att >= 85 ? 'active' : att >= 75 ? 'warning' : 'critical',
    };

    studentsStore = [doc, ...studentsStore];
    setStore(STORAGE_KEYS.STUDENTS, studentsStore);
    return doc;
  },

  // UPDATE: Mark Attendance (+ / - delta)
  markAttendance: async (id, delta) => {
    const i = studentsStore.findIndex(s => s._id === id);
    if (i === -1) return null;

    const currentAtt = studentsStore[i].attendance || 0;
    const newAtt = Math.max(0, Math.min(100, currentAtt + delta));
    studentsStore[i].attendance = newAtt;
    studentsStore[i].status = newAtt >= 85 ? 'active' : newAtt >= 75 ? 'warning' : 'critical';

    setStore(STORAGE_KEYS.STUDENTS, studentsStore);
    return { ...studentsStore[i] };
  },

  // RESET TO DEFAULT DEMO STATE (Useful for quick viva demo reset)
  resetToDemoData: () => {
    studentsStore = [...initialStudents];
    classesStore = [...initialClasses];
    announcementsStore = [...initialAnnouncements];
    setStore(STORAGE_KEYS.STUDENTS, studentsStore);
    setStore(STORAGE_KEYS.CLASSES, classesStore);
    setStore(STORAGE_KEYS.ANNOUNCEMENTS, announcementsStore);
  }
};
