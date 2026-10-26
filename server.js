import app, { connectDB } from './api/index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 SmartCampus API Server running at http://localhost:${PORT}`);
  console.log(`📡 MongoDB URI: ${process.env.MONGODB_URI ? 'Configured ✅' : 'NOT CONFIGURED (Using Fallback) ⚠️'}`);
  console.log(`👉 Test health endpoint: http://localhost:${PORT}/api/health`);
  if (process.env.MONGODB_URI) {
    await connectDB();
  }
});
