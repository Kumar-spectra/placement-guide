import express from 'express';
import { run, all, get } from '../database/db.js';
import { authMiddleware, optionalAuthMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/experiences (get all approved experiences, with search & company filter)
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { company, search, difficulty, result } = req.query;
    let sql = `
      SELECT 
        e.*,
        c.name as company_name,
        c.slug as company_slug,
        c.logo_url as company_logo
      FROM interview_experiences e
      JOIN companies c ON e.company_id = c.id
      WHERE e.status = 'approved'
    `;
    const params = [];

    if (company && company !== 'All') {
      sql += ` AND (c.slug = ? OR c.name LIKE ?)`;
      params.push(company.toLowerCase(), `%${company}%`);
    }
    if (difficulty && difficulty !== 'All') {
      sql += ` AND e.difficulty = ?`;
      params.push(difficulty);
    }
    if (result && result !== 'All') {
      sql += ` AND e.selection_result = ?`;
      params.push(result);
    }
    if (search) {
      sql += ` AND (e.role_title LIKE ? OR e.author_name LIKE ? OR e.college LIKE ? OR e.questions_summary LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    sql += ` ORDER BY e.created_at DESC`;

    const experiences = await all(sql, params);
    const parsed = experiences.map(e => ({
      ...e,
      rounds_data: typeof e.rounds_data === 'string' ? JSON.parse(e.rounds_data) : e.rounds_data
    }));

    res.json({ experiences: parsed });
  } catch (err) {
    console.error('Fetch experiences error:', err);
    res.status(500).json({ error: 'Failed to fetch interview experiences.' });
  }
});

// GET /api/experiences/:id
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await get(
      `SELECT 
        e.*,
        c.name as company_name,
        c.slug as company_slug,
        c.logo_url as company_logo
       FROM interview_experiences e
       JOIN companies c ON e.company_id = c.id
       WHERE e.id = ?`,
      [id]
    );

    if (!exp) {
      return res.status(404).json({ error: 'Interview experience not found.' });
    }

    res.json({
      experience: {
        ...exp,
        rounds_data: typeof exp.rounds_data === 'string' ? JSON.parse(exp.rounds_data) : exp.rounds_data
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interview experience.' });
  }
});

// POST /api/experiences (Submit by user, requires admin moderation)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company_id,
      role_title,
      year,
      college,
      difficulty,
      selection_result,
      rounds_data,
      questions_summary,
      additional_tips
    } = req.body;

    if (!company_id || !role_title || !rounds_data) {
      return res.status(400).json({ error: 'Company, role title, and rounds details are required.' });
    }

    const user = await get('SELECT name, college FROM users WHERE id = ?', [userId]);

    const result = await run(
      `INSERT INTO interview_experiences 
       (user_id, author_name, college, company_id, role_title, year, difficulty, selection_result, rounds_data, questions_summary, additional_tips, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        user ? user.name : 'Anonymous Student',
        college || (user ? user.college : 'Engineering College'),
        company_id,
        role_title,
        year ? Number(year) : 2026,
        difficulty || 'Medium',
        selection_result || 'Selected',
        typeof rounds_data === 'object' ? JSON.stringify(rounds_data) : rounds_data,
        questions_summary || '',
        additional_tips || '',
        req.user.role === 'admin' ? 'approved' : 'pending' // Admin submissions auto-approved
      ]
    );

    res.status(201).json({
      message: req.user.role === 'admin' 
        ? 'Interview experience published!' 
        : 'Interview experience submitted successfully! It will be live once reviewed by admin.',
      id: result.id
    });
  } catch (err) {
    console.error('Submit experience error:', err);
    res.status(500).json({ error: 'Failed to submit interview experience.' });
  }
});

// PUT /api/experiences/:id/status (Admin Approve / Reject)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await run('UPDATE interview_experiences SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Interview experience marked as ${status}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience status.' });
  }
});

export default router;
