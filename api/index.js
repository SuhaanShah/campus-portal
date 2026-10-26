import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for Windows / ISP DNS resolving mongodb+srv records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Database Connection (Cached for Serverless) ─────────────────
let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI environment variable is not defined.');
    return;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
    await seedInitialData();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
}

// ── Mongoose Models ─────────────────────────────────────────────
const studentSchema = new mongoose.Schema({
  _id: { type: String, default: () => `s${Date.now()}` },
  name: { type: String, required: true },
  roll: { type: String, required: true, unique: true },
  branch: { type: String, default: 'Computer Sci.' },
  year: { type: Number, default: 1 },
  cgpa: { type: Number, default: 8.0 },
  attendance: { type: Number, default: 85 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'warning', 'critical'], default: 'active' },
}, { timestamps: true });

const classSchema = new mongoose.Schema({
  _id: { type: String, default: () => `c${Date.now()}` },
  subject: String,
  code: String,
  professor: String,
  room: String,
  time: String,
  day: String,
  duration: Number,
  enrolled: Number,
});

const announcementSchema = new mongoose.Schema({
  _id: { type: String, default: () => `a${Date.now()}` },
  title: String,
  body: String,
  category: { type: String, default: 'general' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
  author: String,
  date: String,
  pinned: { type: Boolean, default: false },
});

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export const Class = mongoose.models.Class || mongoose.model('Class', classSchema);
export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

// Initial Seed Data
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

async function seedInitialData() {
  try {
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany(initialStudents);
      console.log('🌱 Seeded initial students into MongoDB');
    }
    const classCount = await Class.countDocuments();
    if (classCount === 0) {
      await Class.insertMany(initialClasses);
      console.log('🌱 Seeded initial classes into MongoDB');
    }
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.insertMany(initialAnnouncements);
      console.log('🌱 Seeded initial announcements into MongoDB');
    }
  } catch (err) {
    console.warn('Seeding warning:', err.message);
  }
}

// ── Middleware: Ensure DB Connection ────────────────────────────
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  }
  next();
});

// ── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', database: dbStatus, timestamp: new Date().toISOString() });
});

// ── AUTH: Login ─────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) return res.status(400).json({ success: false, error: 'Please enter your Roll Number or University Email.' });
    if (!cleanPass) return res.status(400).json({ success: false, error: 'Please enter your account password.' });

    // 1. Admin login check
    if (cleanId === 'admin' || cleanId === 'admin@campus.edu') {
      if (cleanPass === 'admin@123') {
        return res.json({
          success: true,
          user: {
            _id: 'adm01',
            name: 'Suhaan A.',
            email: 'admin@campus.edu',
            role: 'admin',
            title: 'Head of Student Affairs · CS Dept.',
            avatar: 'SA',
          }
        });
      } else {
        return res.status(401).json({ success: false, error: 'Incorrect admin password. (Hint: default is admin@123)' });
      }
    }

    // 2. Student lookup
    let student = null;
    if (mongoose.connection.readyState === 1) {
      student = await Student.findOne({
        $or: [
          { roll: new RegExp(`^${cleanId}$`, 'i') },
          { email: new RegExp(`^${cleanId}$`, 'i') }
        ]
      }).lean();
    } else {
      // Fallback to initial students if DB offline
      student = initialStudents.find(s =>
        s.roll.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId
      );
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `No student record found for "${identifier}". Please check your Roll Number / Email or create an account.`
      });
    }

    const expectedPass = student.password || `${student.name.split(' ')[0].toLowerCase()}@123`;
    if (expectedPass !== cleanPass) {
      return res.status(401).json({
        success: false,
        error: `Incorrect password for ${student.name} (${student.roll}). Please enter the correct password.`
      });
    }

    res.json({
      success: true,
      user: {
        ...student,
        role: 'student'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── AUTH: Register ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const data = req.body;
    const roll = (data.roll || '').trim().toUpperCase();
    const email = (data.email || '').trim().toLowerCase();

    if (!roll || !email || !data.name) {
      return res.status(400).json({ success: false, error: 'Name, Roll Number, and Email are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await Student.findOne({
        $or: [
          { roll: new RegExp(`^${roll}$`, 'i') },
          { email: new RegExp(`^${email}$`, 'i') }
        ]
      });

      if (existing) {
        if (existing.roll.toUpperCase() === roll) {
          return res.status(400).json({ success: false, error: `Roll number ${roll} is already registered.` });
        }
        return res.status(400).json({ success: false, error: `Email address ${email} is already in use.` });
      }

      const doc = new Student({
        name: data.name.trim(),
        roll: roll,
        branch: data.branch || 'Computer Sci.',
        year: parseInt(data.year, 10) || 1,
        cgpa: parseFloat(data.cgpa) || 8.0,
        attendance: parseInt(data.attendance, 10) || 85,
        email: email,
        password: data.password || 'student@123',
        status: 'active',
      });

      await doc.save();
      return res.json({
        success: true,
        user: {
          ...doc.toObject(),
          role: 'student'
        }
      });
    } else {
      return res.status(503).json({
        success: false,
        error: 'Database is not connected. Please configure MONGODB_URI.'
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── AUTH: Change Password ───────────────────────────────────────
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { studentId, currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters.' });
    }

    if (mongoose.connection.readyState === 1) {
      const student = await Student.findById(studentId);
      if (!student) return res.status(404).json({ success: false, error: 'Student account not found.' });

      const currentActual = student.password || `${student.name.split(' ')[0].toLowerCase()}@123`;
      if (currentActual !== currentPassword) {
        return res.status(400).json({ success: false, error: 'Current password does not match.' });
      }

      student.password = newPassword;
      await student.save();
      return res.json({ success: true, message: 'Password updated successfully!' });
    } else {
      return res.status(503).json({ success: false, error: 'Database not connected.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── STUDENTS: Get All ───────────────────────────────────────────
app.get('/api/students', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const list = await Student.find().lean();
      return res.json(list);
    }
    res.json(initialStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STUDENTS: Create / Add ──────────────────────────────────────
app.post('/api/students', async (req, res) => {
  try {
    const data = req.body;
    if (mongoose.connection.readyState === 1) {
      const doc = new Student({
        name: data.name,
        roll: data.roll,
        branch: data.branch || 'Computer Sci.',
        year: parseInt(data.year, 10) || 1,
        cgpa: parseFloat(data.cgpa) || 8.0,
        attendance: parseInt(data.attendance, 10) || 85,
        email: data.email,
        password: data.password || 'student@123',
        status: 'active',
      });
      await doc.save();
      return res.json(doc);
    }
    res.status(503).json({ error: 'Database not connected.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STUDENTS: Mark Attendance ───────────────────────────────────
app.patch('/api/students/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (mongoose.connection.readyState === 1) {
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ error: 'Student not found.' });

      student.attendance = Math.max(0, Math.min(100, student.attendance + (delta || 0)));
      student.status =
        student.attendance >= 85 ? 'active' :
        student.attendance >= 75 ? 'warning' : 'critical';

      await student.save();
      return res.json(student);
    }
    res.status(503).json({ error: 'Database not connected.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CLASSES: Get All ────────────────────────────────────────────
app.get('/api/classes', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const list = await Class.find().lean();
      return res.json(list);
    }
    res.json(initialClasses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ANNOUNCEMENTS: Get All ──────────────────────────────────────
app.get('/api/announcements', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const list = await Announcement.find().sort({ pinned: -1, date: -1 }).lean();
      return res.json(list);
    }
    res.json(initialAnnouncements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STATS: Aggregations ─────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    let students = initialStudents;
    let classes = initialClasses;
    let announcements = initialAnnouncements;

    if (mongoose.connection.readyState === 1) {
      students = await Student.find().lean();
      classes = await Class.find().lean();
      announcements = await Announcement.find().lean();
    }

    const totalStudents = students.length;
    const totalClasses = classes.length;
    const avgAttendance = totalStudents > 0
      ? Math.round(students.reduce((a, s) => a + (s.attendance || 0), 0) / totalStudents)
      : 0;
    const avgCgpa = totalStudents > 0
      ? (students.reduce((a, s) => a + (s.cgpa || 0), 0) / totalStudents).toFixed(2)
      : '0.00';
    const lowAttendance = students.filter(s => (s.attendance || 0) < 75).length;
    const highPriorityAnnouncements = announcements.filter(a => a.priority === 'high').length;

    res.json({
      totalStudents,
      totalClasses,
      avgAttendance,
      avgCgpa,
      lowAttendance,
      highPriorityAnnouncements,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ATTENDANCE TREND & RESULTS ──────────────────────────────────
app.get('/api/attendance-trend', (req, res) => {
  res.json([
    { month: 'Jul', CS: 94, EC: 89, ME: 85, CE: 91 },
    { month: 'Aug', CS: 91, EC: 87, ME: 82, CE: 88 },
    { month: 'Sep', CS: 88, EC: 84, ME: 79, CE: 85 },
    { month: 'Oct', CS: 93, EC: 90, ME: 86, CE: 89 },
  ]);
});

app.get('/api/sem-results', (req, res) => {
  res.json([
    { sem: 'Sem 1', avg: 7.8 },
    { sem: 'Sem 2', avg: 8.1 },
    { sem: 'Sem 3', avg: 8.4 },
    { sem: 'Sem 4', avg: 8.7 },
    { sem: 'Sem 5', avg: 8.9 },
  ]);
});

export default app;
