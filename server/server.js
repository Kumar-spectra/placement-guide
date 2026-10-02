import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb } from './database/db.js';
import { seedDatabase } from './database/seed.js';

import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import questionRoutes from './routes/questions.js';
import experienceRoutes from './routes/experiences.js';
import practiceRoutes from './routes/practice.js';
import mockInterviewRoutes from './routes/mockInterview.js';
import roadmapRoutes from './routes/roadmaps.js';
import resumeRoutes from './routes/resume.js';
import bookmarkRoutes from './routes/bookmarks.js';
import progressRoutes from './routes/progress.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Placement Guide API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

// Initialize & Seed Database
const startServer = async () => {
  try {
    await initDb();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Placement Guide Server running on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
