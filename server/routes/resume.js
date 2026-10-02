import express from 'express';
import { generateResumeQuestions } from '../services/aiService.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/resume/analyze
router.post('/analyze', optionalAuthMiddleware, async (req, res) => {
  try {
    const { resumeText, targetCompany, targetRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Please paste or upload your resume text.' });
    }

    const analysis = await generateResumeQuestions({
      resumeText,
      targetCompany: targetCompany || 'Top Product & IT Companies',
      targetRole: targetRole || 'Software Development Engineer'
    });

    res.json({
      message: 'Resume analyzed successfully!',
      analysis
    });
  } catch (err) {
    console.error('Resume analyze error:', err);
    res.status(500).json({ error: 'Failed to analyze resume.' });
  }
});

export default router;
