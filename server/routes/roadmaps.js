import express from 'express';
import { run, all, get } from '../database/db.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { generatePlacementRoadmap } from '../services/aiService.js';

const router = express.Router();

// GET /api/roadmaps
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const roadmaps = await all('SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const parsed = roadmaps.map(r => ({
      ...r,
      weeks: JSON.parse(r.structure || '[]')
    }));

    res.json({ roadmaps: parsed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmaps.' });
  }
});

// GET /api/roadmaps/:id
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await get('SELECT * FROM roadmaps WHERE id = ?', [id]);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    res.json({
      roadmap: {
        ...roadmap,
        weeks: JSON.parse(roadmap.structure || '[]')
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap details.' });
  }
});

// POST /api/roadmaps/generate
router.post('/generate', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { targetRole, targetCompanies, durationDays, currentLevel, skills } = req.body;

    const generated = generatePlacementRoadmap({
      targetRole: targetRole || 'Software Development Engineer',
      targetCompanies: targetCompanies || 'Amazon, Google, Microsoft, TCS',
      durationDays: Number(durationDays) || 60,
      currentLevel: currentLevel || 'Intermediate',
      skills
    });

    const result = await run(
      `INSERT INTO roadmaps (user_id, title, target_role, target_companies, duration_days, current_level, structure)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        generated.title,
        generated.target_role,
        generated.target_companies,
        generated.duration_days,
        generated.current_level,
        JSON.stringify(generated.weeks)
      ]
    );

    res.status(201).json({
      message: 'Personalized roadmap created successfully!',
      roadmapId: result.id,
      roadmap: {
        id: result.id,
        ...generated
      }
    });
  } catch (err) {
    console.error('Roadmap generate error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

// PUT /api/roadmaps/:id/toggle-task
router.put('/:id/toggle-task', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId } = req.body;

    const roadmap = await get('SELECT * FROM roadmaps WHERE id = ?', [id]);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    const weeks = JSON.parse(roadmap.structure || '[]');
    let updated = false;

    for (const week of weeks) {
      for (const task of week.tasks) {
        if (task.id === taskId) {
          task.completed = !task.completed;
          updated = true;
          break;
        }
      }
      if (updated) break;
    }

    await run('UPDATE roadmaps SET structure = ? WHERE id = ?', [JSON.stringify(weeks), id]);

    res.json({ message: 'Task status updated!', weeks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle task.' });
  }
});

export default router;
