import express from 'express';
import bcrypt from 'bcryptjs';
import { run, get } from '../database/db.js';
import { authMiddleware, signToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      degree,
      branch,
      graduationYear,
      targetRole,
      targetCompanies,
      skills,
      preparationLevel
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run(
      `INSERT INTO users (name, email, password_hash, role, college, degree, branch, graduation_year, target_role, target_companies, skills, preparation_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        passwordHash,
        'student',
        college || '',
        degree || '',
        branch || '',
        graduationYear ? Number(graduationYear) : 2026,
        targetRole || 'Software Development Engineer',
        targetCompanies || 'Amazon, Google, Microsoft, TCS',
        skills || 'JavaScript, Python, SQL, DSA',
        preparationLevel || 'Beginner'
      ]
    );

    const user = await get('SELECT id, name, email, role, college, degree, branch, graduation_year, target_role, target_companies, skills, preparation_level, created_at FROM users WHERE id = ?', [result.id]);
    const token = signToken(user);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);
    const { password_hash, ...userProfile } = user;

    res.json({
      message: 'Login successful!',
      token,
      user: userProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// POST /api/auth/demo-login (Quick one-click login for testing student or admin)
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body; // 'student' or 'admin'
    const targetEmail = role === 'admin' ? 'admin@placementguide.com' : 'student@placementguide.com';
    const user = await get('SELECT * FROM users WHERE email = ?', [targetEmail]);

    if (!user) {
      return res.status(404).json({ error: 'Demo user not found. Please run seed.' });
    }

    const token = signToken(user);
    const { password_hash, ...userProfile } = user;

    res.json({
      message: `Logged in as ${user.name} (${user.role})!`,
      token,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({ error: 'Demo login error.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await get(
      'SELECT id, name, email, role, college, degree, branch, graduation_year, target_role, target_companies, skills, preparation_level, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      college,
      degree,
      branch,
      graduation_year,
      target_role,
      target_companies,
      skills,
      preparation_level
    } = req.body;

    await run(
      `UPDATE users 
       SET name = COALESCE(?, name),
           college = COALESCE(?, college),
           degree = COALESCE(?, degree),
           branch = COALESCE(?, branch),
           graduation_year = COALESCE(?, graduation_year),
           target_role = COALESCE(?, target_role),
           target_companies = COALESCE(?, target_companies),
           skills = COALESCE(?, skills),
           preparation_level = COALESCE(?, preparation_level)
       WHERE id = ?`,
      [
        name,
        college,
        degree,
        branch,
        graduation_year ? Number(graduation_year) : null,
        target_role,
        target_companies,
        skills,
        preparation_level,
        req.user.id
      ]
    );

    const updatedUser = await get(
      'SELECT id, name, email, role, college, degree, branch, graduation_year, target_role, target_companies, skills, preparation_level, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
