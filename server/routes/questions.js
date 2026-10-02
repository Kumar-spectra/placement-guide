import express from 'express';
import { run, all, get } from '../database/db.js';
import { authMiddleware, optionalAuthMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/questions (filter by topic, company, difficulty, search, frequency)
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { topic, company, difficulty, search, frequency, questionType } = req.query;
    const userId = req.user?.id || null;

    let sql = `
      SELECT 
        q.*,
        GROUP_CONCAT(DISTINCT c.name) as companies,
        GROUP_CONCAT(DISTINCT c.slug) as company_slugs,
        MAX(cq.report_count) as max_report_count,
        MAX(cq.frequency_label) as frequency_label,
        ${userId ? `(SELECT 1 FROM bookmarks WHERE user_id = ${userId} AND item_type = 'question' AND item_id = q.id) as is_bookmarked,` : '0 as is_bookmarked,'}
        ${userId ? `(SELECT status FROM user_progress WHERE user_id = ${userId} AND item_type = 'question' AND item_id = q.id) as progress_status` : 'NULL as progress_status'}
      FROM questions q
      LEFT JOIN company_questions cq ON q.id = cq.question_id
      LEFT JOIN companies c ON cq.company_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (q.question LIKE ? OR q.answer LIKE ? OR q.tags LIKE ? OR q.subtopic LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (topic && topic !== 'All') {
      sql += ` AND q.topic = ?`;
      params.push(topic);
    }
    if (difficulty && difficulty !== 'All') {
      sql += ` AND q.difficulty = ?`;
      params.push(difficulty);
    }
    if (company && company !== 'All') {
      sql += ` AND (c.slug = ? OR c.name LIKE ?)`;
      params.push(company.toLowerCase(), `%${company}%`);
    }
    if (frequency && frequency !== 'All') {
      sql += ` AND cq.frequency_label = ?`;
      params.push(frequency);
    }
    if (questionType && questionType !== 'All') {
      sql += ` AND q.question_type = ?`;
      params.push(questionType);
    }

    sql += ` GROUP BY q.id ORDER BY max_report_count DESC, q.id DESC`;

    const questions = await all(sql, params);

    // Format list
    const formatted = questions.map(q => ({
      ...q,
      is_bookmarked: Boolean(q.is_bookmarked),
      companies: q.companies ? q.companies.split(',') : [],
      company_slugs: q.company_slugs ? q.company_slugs.split(',') : []
    }));

    res.json({ questions: formatted });
  } catch (err) {
    console.error('Fetch questions error:', err);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

// GET /api/questions/:id
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const question = await get(
      `SELECT 
        q.*,
        ${userId ? `(SELECT 1 FROM bookmarks WHERE user_id = ${userId} AND item_type = 'question' AND item_id = q.id) as is_bookmarked,` : '0 as is_bookmarked,'}
        ${userId ? `(SELECT status FROM user_progress WHERE user_id = ${userId} AND item_type = 'question' AND item_id = q.id) as progress_status` : 'NULL as progress_status'}
       FROM questions q
       WHERE q.id = ?`,
      [id]
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Linked companies details
    const linkedCompanies = await all(
      `SELECT c.id, c.name, c.slug, c.logo_url, cq.role_name, cq.reported_year, cq.frequency_label, cq.report_count
       FROM company_questions cq
       JOIN companies c ON cq.company_id = c.id
       WHERE cq.question_id = ?`,
      [id]
    );

    // Related questions (same topic)
    const relatedQuestions = await all(
      `SELECT id, question, topic, difficulty, question_type FROM questions WHERE topic = ? AND id != ? LIMIT 5`,
      [question.topic, id]
    );

    res.json({
      question: {
        ...question,
        is_bookmarked: Boolean(question.is_bookmarked),
        linked_companies: linkedCompanies,
        related_questions: relatedQuestions
      }
    });
  } catch (err) {
    console.error('Fetch question detail error:', err);
    res.status(500).json({ error: 'Failed to fetch question.' });
  }
});

// POST /api/questions/:id/toggle-progress
router.post('/:id/toggle-progress', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const question = await get('SELECT topic FROM questions WHERE id = ?', [id]);

    const existing = await get(
      'SELECT id, status FROM user_progress WHERE user_id = ? AND item_type = ? AND item_id = ?',
      [userId, 'question', id]
    );

    if (existing) {
      // Toggle or remove
      await run('DELETE FROM user_progress WHERE id = ?', [existing.id]);
      return res.json({ completed: false, message: 'Question marked as uncompleted.' });
    } else {
      await run(
        'INSERT INTO user_progress (user_id, item_type, item_id, status, score, topic) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, 'question', id, 'completed', 100, question ? question.topic : 'General']
      );
      return res.json({ completed: true, message: 'Question marked as completed!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

// POST /api/questions (Admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { question, answer, topic, subtopic, difficulty, question_type, source, interview_tip, code_snippet, tags, company_ids } = req.body;
    if (!question || !answer || !topic) {
      return res.status(400).json({ error: 'Question, answer, and topic are required.' });
    }

    const result = await run(
      `INSERT INTO questions (question, answer, topic, subtopic, difficulty, question_type, source, interview_tip, code_snippet, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        question,
        answer,
        topic,
        subtopic || '',
        difficulty || 'Medium',
        question_type || 'Technical Interview',
        source || 'Admin Upload',
        interview_tip || '',
        code_snippet || null,
        tags || ''
      ]
    );

    const questionId = result.id;
    if (company_ids && Array.isArray(company_ids)) {
      for (const cId of company_ids) {
        await run(
          `INSERT INTO company_questions (company_id, question_id, frequency_label, report_count) VALUES (?, ?, ?, ?)`,
          [cId, questionId, 'Frequently Reported', 10]
        );
      }
    }

    const created = await get('SELECT * FROM questions WHERE id = ?', [questionId]);
    res.status(201).json({ message: 'Question created successfully!', question: created });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create question.' });
  }
});

// PUT /api/questions/:id (Admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, topic, subtopic, difficulty, question_type, source, interview_tip, code_snippet, tags } = req.body;

    await run(
      `UPDATE questions
       SET question = COALESCE(?, question),
           answer = COALESCE(?, answer),
           topic = COALESCE(?, topic),
           subtopic = COALESCE(?, subtopic),
           difficulty = COALESCE(?, difficulty),
           question_type = COALESCE(?, question_type),
           source = COALESCE(?, source),
           interview_tip = COALESCE(?, interview_tip),
           code_snippet = COALESCE(?, code_snippet),
           tags = COALESCE(?, tags),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [question, answer, topic, subtopic, difficulty, question_type, source, interview_tip, code_snippet, tags, id]
    );

    const updated = await get('SELECT * FROM questions WHERE id = ?', [id]);
    res.json({ message: 'Question updated successfully!', question: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question.' });
  }
});

// DELETE /api/questions/:id (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM questions WHERE id = ?', [id]);
    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question.' });
  }
});

export default router;
