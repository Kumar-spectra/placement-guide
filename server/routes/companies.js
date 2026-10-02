import express from 'express';
import { run, all, get } from '../database/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/companies (with search, difficulty, industry filter)
router.get('/', async (req, res) => {
  try {
    const { search, difficulty, industry } = req.query;
    let sql = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM company_questions WHERE company_id = c.id) as question_count,
        (SELECT COUNT(*) FROM interview_experiences WHERE company_id = c.id AND status = 'approved') as experience_count,
        (SELECT COUNT(*) FROM rounds WHERE company_id = c.id) as round_count
      FROM companies c
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (c.name LIKE ? OR c.description LIKE ? OR c.popular_roles LIKE ? OR c.industry LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (difficulty && difficulty !== 'All') {
      sql += ` AND c.difficulty = ?`;
      params.push(difficulty);
    }
    if (industry && industry !== 'All') {
      sql += ` AND c.industry LIKE ?`;
      params.push(`%${industry}%`);
    }

    sql += ` ORDER BY c.name ASC`;

    const companies = await all(sql, params);
    res.json({ companies });
  } catch (err) {
    console.error('Fetch companies error:', err);
    res.status(500).json({ error: 'Failed to fetch companies.' });
  }
});

// GET /api/companies/:slug (Company Details + Rounds + Questions + Experiences)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const company = await get('SELECT * FROM companies WHERE slug = ? OR id = ?', [slug, slug]);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Fetch rounds
    const rounds = await all('SELECT * FROM rounds WHERE company_id = ? ORDER BY order_number ASC', [company.id]);

    // Fetch linked questions
    const questions = await all(
      `SELECT 
        q.id, q.question, q.answer, q.topic, q.subtopic, q.difficulty, q.question_type, q.source, q.interview_tip, q.code_snippet, q.tags,
        cq.role_name, cq.reported_year, cq.frequency_label, cq.report_count, cq.round_id
       FROM questions q
       JOIN company_questions cq ON q.id = cq.question_id
       WHERE cq.company_id = ?
       ORDER BY cq.report_count DESC`,
      [company.id]
    );

    // Fetch approved interview experiences
    const experiences = await all(
      `SELECT * FROM interview_experiences WHERE company_id = ? AND status = 'approved' ORDER BY created_at DESC`,
      [company.id]
    );

    res.json({
      company,
      rounds,
      questions,
      experiences
    });
  } catch (err) {
    console.error('Fetch company details error:', err);
    res.status(500).json({ error: 'Failed to fetch company details.' });
  }
});

// POST /api/companies (Admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      slug,
      logo_url,
      description,
      website,
      industry,
      difficulty,
      hiring_type,
      popular_roles,
      eligibility,
      interview_overview
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Company name and slug are required.' });
    }

    const result = await run(
      `INSERT INTO companies (name, slug, logo_url, description, website, industry, difficulty, hiring_type, popular_roles, eligibility, interview_overview)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug.toLowerCase().trim(),
        logo_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
        description || '',
        website || '',
        industry || 'Technology',
        difficulty || 'Medium',
        hiring_type || 'Campus & Off-Campus',
        popular_roles || 'Software Engineer',
        eligibility || 'B.Tech/MCA with 60%+',
        interview_overview || ''
      ]
    );

    const newCompany = await get('SELECT * FROM companies WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Company created successfully!', company: newCompany });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create company.' });
  }
});

// PUT /api/companies/:id (Admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      logo_url,
      description,
      website,
      industry,
      difficulty,
      hiring_type,
      popular_roles,
      eligibility,
      interview_overview
    } = req.body;

    await run(
      `UPDATE companies 
       SET name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           logo_url = COALESCE(?, logo_url),
           description = COALESCE(?, description),
           website = COALESCE(?, website),
           industry = COALESCE(?, industry),
           difficulty = COALESCE(?, difficulty),
           hiring_type = COALESCE(?, hiring_type),
           popular_roles = COALESCE(?, popular_roles),
           eligibility = COALESCE(?, eligibility),
           interview_overview = COALESCE(?, interview_overview),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, slug, logo_url, description, website, industry, difficulty, hiring_type, popular_roles, eligibility, interview_overview, id]
    );

    const updated = await get('SELECT * FROM companies WHERE id = ?', [id]);
    res.json({ message: 'Company updated successfully!', company: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company.' });
  }
});

// DELETE /api/companies/:id (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM companies WHERE id = ?', [id]);
    res.json({ message: 'Company deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete company.' });
  }
});

export default router;
