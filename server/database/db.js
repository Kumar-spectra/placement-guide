import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'placement_guide.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Helper for promise-based queries
export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const initDb = async () => {
  // Users table
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    college TEXT,
    degree TEXT,
    branch TEXT,
    graduation_year INTEGER,
    target_role TEXT DEFAULT 'Software Development Engineer',
    target_companies TEXT DEFAULT 'Amazon, Microsoft, TCS, Google',
    skills TEXT DEFAULT 'JavaScript, Python, SQL, DSA',
    preparation_level TEXT DEFAULT 'Intermediate',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Companies table
  await run(`CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    website TEXT,
    industry TEXT DEFAULT 'Technology',
    difficulty TEXT DEFAULT 'Medium',
    hiring_type TEXT DEFAULT 'On-Campus / Off-Campus',
    popular_roles TEXT,
    eligibility TEXT,
    interview_overview TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Rounds table
  await run(`CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    typical_topics TEXT,
    question_types TEXT,
    difficulty TEXT DEFAULT 'Medium',
    preparation_tips TEXT,
    order_number INTEGER DEFAULT 1,
    FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE
  )`);

  // Questions table
  await run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    topic TEXT NOT NULL,
    subtopic TEXT,
    difficulty TEXT DEFAULT 'Medium',
    question_type TEXT DEFAULT 'Technical Interview',
    source TEXT DEFAULT 'Reported Interview Experience',
    interview_tip TEXT,
    code_snippet TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Company Questions (Link table with frequency & reported data)
  await run(`CREATE TABLE IF NOT EXISTS company_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    round_id INTEGER,
    role_name TEXT,
    reported_year INTEGER DEFAULT 2026,
    frequency_label TEXT DEFAULT 'Frequently Reported',
    report_count INTEGER DEFAULT 12,
    FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE
  )`);

  // Coding Problems table
  await run(`CREATE TABLE IF NOT EXISTS coding_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    difficulty TEXT DEFAULT 'Medium',
    topic TEXT NOT NULL,
    description TEXT NOT NULL,
    examples TEXT NOT NULL,
    constraints TEXT,
    starter_code TEXT NOT NULL,
    test_cases TEXT NOT NULL,
    solution_code TEXT,
    companies TEXT,
    hints TEXT
  )`);

  // Interview Experiences table
  await run(`CREATE TABLE IF NOT EXISTS interview_experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    author_name TEXT NOT NULL,
    college TEXT,
    company_id INTEGER NOT NULL,
    role_title TEXT NOT NULL,
    year INTEGER DEFAULT 2026,
    difficulty TEXT DEFAULT 'Medium',
    selection_result TEXT DEFAULT 'Selected',
    rounds_data TEXT NOT NULL,
    questions_summary TEXT,
    additional_tips TEXT,
    status TEXT DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE
  )`);

  // Bookmarks table
  await run(`CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_type TEXT NOT NULL, -- 'question', 'company', 'experience', 'problem'
    item_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_type, item_id)
  )`);

  // User Progress table (Questions & Coding)
  await run(`CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_type TEXT DEFAULT 'question',
    item_id INTEGER NOT NULL,
    status TEXT DEFAULT 'completed', -- 'completed', 'reviewing', 'attempted'
    score INTEGER DEFAULT 100,
    topic TEXT,
    notes TEXT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Mock Interviews table
  await run(`CREATE TABLE IF NOT EXISTS mock_interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_name TEXT,
    role_name TEXT,
    interview_type TEXT DEFAULT 'Technical',
    difficulty TEXT DEFAULT 'Medium',
    overall_score INTEGER DEFAULT 0,
    concept_accuracy INTEGER DEFAULT 0,
    communication_score INTEGER DEFAULT 0,
    completeness_score INTEGER DEFAULT 0,
    technical_depth INTEGER DEFAULT 0,
    problem_solving INTEGER DEFAULT 0,
    strengths TEXT,
    weak_areas TEXT,
    improvement_suggestions TEXT,
    recommended_topics TEXT,
    transcript TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Roadmaps table
  await run(`CREATE TABLE IF NOT EXISTS roadmaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    target_role TEXT,
    target_companies TEXT,
    duration_days INTEGER DEFAULT 60,
    current_level TEXT,
    structure TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Practice Quiz Sessions
  await run(`CREATE TABLE IF NOT EXISTS practice_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT,
    company_name TEXT,
    total_questions INTEGER,
    correct_answers INTEGER,
    score_percentage REAL,
    time_taken_seconds INTEGER,
    weak_topics TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
};

export default db;
