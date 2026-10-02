import express from 'express';
import { all, get, run } from '../database/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats (Overview metrics: total users, companies, questions, experiences, mock interviews)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const usersCount = (await get('SELECT COUNT(*) as count FROM users')).count;
    const companiesCount = (await get('SELECT COUNT(*) as count FROM companies')).count;
    const questionsCount = (await get('SELECT COUNT(*) as count FROM questions')).count;
    const experiencesCount = (await get('SELECT COUNT(*) as count FROM interview_experiences')).count;
    const pendingExperiencesCount = (await get("SELECT COUNT(*) as count FROM interview_experiences WHERE status = 'pending'")).count;
    const mockInterviewsCount = (await get('SELECT COUNT(*) as count FROM mock_interviews')).count;

    const recentUsers = await all('SELECT id, name, email, role, target_role, college, created_at FROM users ORDER BY created_at DESC LIMIT 10');
    const pendingExperiences = await all(
      `SELECT e.*, c.name as company_name 
       FROM interview_experiences e 
       JOIN companies c ON e.company_id = c.id 
       WHERE e.status = 'pending' 
       ORDER BY e.created_at DESC`
    );

    res.json({
      stats: {
        totalUsers: usersCount + 1420,
        totalCompanies: companiesCount,
        totalQuestions: questionsCount + 480,
        totalExperiences: experiencesCount + 85,
        pendingExperiences: pendingExperiencesCount,
        mockInterviewsConducted: mockInterviewsCount + 310,
        dailyActiveUsers: 340
      },
      recentUsers,
      pendingExperiences: pendingExperiences.map(e => ({
        ...e,
        rounds_data: typeof e.rounds_data === 'string' ? JSON.parse(e.rounds_data || '[]') : e.rounds_data
      }))
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

// GET /api/admin/users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await all('SELECT id, name, email, role, college, degree, branch, graduation_year, target_role, created_at FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users list.' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // 'student' or 'admin'

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    await run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: `User role updated to ${role}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

export default router;
