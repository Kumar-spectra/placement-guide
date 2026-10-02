import express from 'express';
import { run, all, get } from '../database/db.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/bookmarks (Fetch all bookmarked questions, companies, experiences)
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    // Bookmarked Questions
    const questions = await all(
      `SELECT q.*, b.id as bookmark_id, b.created_at as bookmarked_at
       FROM bookmarks b
       JOIN questions q ON b.item_id = q.id
       WHERE b.user_id = ? AND b.item_type = 'question'
       ORDER BY b.created_at DESC`,
      [userId]
    );

    // Bookmarked Companies
    const companies = await all(
      `SELECT c.*, b.id as bookmark_id, b.created_at as bookmarked_at
       FROM bookmarks b
       JOIN companies c ON b.item_id = c.id
       WHERE b.user_id = ? AND b.item_type = 'company'
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({
      bookmarks: {
        questions,
        companies
      }
    });
  } catch (err) {
    console.error('Fetch bookmarks error:', err);
    res.status(500).json({ error: 'Failed to fetch bookmarks.' });
  }
});

// POST /api/bookmarks/toggle (Toggle bookmark for question or company)
router.post('/toggle', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { item_type, item_id } = req.body;

    if (!item_type || !item_id) {
      return res.status(400).json({ error: 'item_type and item_id are required.' });
    }

    const existing = await get(
      'SELECT id FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?',
      [userId, item_type, item_id]
    );

    if (existing) {
      await run('DELETE FROM bookmarks WHERE id = ?', [existing.id]);
      return res.json({ bookmarked: false, message: 'Bookmark removed.' });
    } else {
      await run(
        'INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)',
        [userId, item_type, item_id]
      );
      return res.json({ bookmarked: true, message: 'Bookmark saved!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle bookmark.' });
  }
});

export default router;
