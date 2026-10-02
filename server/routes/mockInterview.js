import express from 'express';
import { run, all, get } from '../database/db.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/auth.js';
import { evaluateMockAnswer } from '../services/aiService.js';

const router = express.Router();

// POST /api/mock-interview/start
router.post('/start', optionalAuthMiddleware, async (req, res) => {
  try {
    const { companyName = 'Amazon', roleName = 'Software Development Engineer', interviewType = 'Technical', difficulty = 'Medium', questionCount = 5 } = req.body;

    // Pick questions from DB or generate
    let sql = `
      SELECT q.id, q.question, q.topic, q.subtopic, q.difficulty, q.question_type, q.interview_tip
      FROM questions q
      WHERE 1=1
    `;
    const params = [];

    if (interviewType === 'Behavioral' || interviewType === 'HR') {
      sql += ` AND q.topic = 'HR & Behavioral'`;
    } else if (interviewType === 'Technical') {
      sql += ` AND q.topic != 'HR & Behavioral'`;
    }

    sql += ` ORDER BY RANDOM() LIMIT ?`;
    params.push(Math.min(10, Number(questionCount) || 5));

    let questions = await all(sql, params);

    if (questions.length === 0) {
      questions = await all(`SELECT id, question, topic, subtopic, difficulty, question_type, interview_tip FROM questions ORDER BY RANDOM() LIMIT 5`);
    }

    const sessionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      sessionId,
      companyName,
      roleName,
      interviewType,
      difficulty,
      totalQuestions: questions.length,
      questions
    });
  } catch (err) {
    console.error('Start mock error:', err);
    res.status(500).json({ error: 'Failed to start mock interview session.' });
  }
});

// POST /api/mock-interview/evaluate - Real-time AI evaluation for a single answer
router.post('/evaluate', optionalAuthMiddleware, async (req, res) => {
  try {
    const { question, userAnswer, topic, difficulty, companyName, roleName } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ error: 'Please provide an answer to evaluate.' });
    }

    const evaluation = await evaluateMockAnswer({
      question,
      userAnswer,
      topic: topic || 'DSA',
      difficulty: difficulty || 'Medium',
      companyName,
      roleName
    });

    res.json({ evaluation });
  } catch (err) {
    console.error('Evaluate answer error:', err);
    res.status(500).json({ error: 'Failed to evaluate answer.' });
  }
});

// POST /api/mock-interview/finish - Complete interview and save scorecard
router.post('/finish', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const {
      companyName,
      roleName,
      interviewType,
      difficulty,
      overallScore,
      conceptAccuracy,
      communicationScore,
      completenessScore,
      technicalDepth,
      problemSolving,
      strengths,
      weakAreas,
      improvementSuggestions,
      recommendedTopics,
      transcript
    } = req.body;

    const result = await run(
      `INSERT INTO mock_interviews 
       (user_id, company_name, role_name, interview_type, difficulty, overall_score, concept_accuracy, communication_score, completeness_score, technical_depth, problem_solving, strengths, weak_areas, improvement_suggestions, recommended_topics, transcript)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        companyName || 'Top Tech Company',
        roleName || 'Software Engineer',
        interviewType || 'Technical',
        difficulty || 'Medium',
        overallScore || 75,
        conceptAccuracy || 70,
        communicationScore || 75,
        completenessScore || 70,
        technicalDepth || 70,
        problemSolving || 75,
        Array.isArray(strengths) ? JSON.stringify(strengths) : (strengths || '[]'),
        Array.isArray(weakAreas) ? JSON.stringify(weakAreas) : (weakAreas || '[]'),
        Array.isArray(improvementSuggestions) ? JSON.stringify(improvementSuggestions) : (improvementSuggestions || '[]'),
        Array.isArray(recommendedTopics) ? JSON.stringify(recommendedTopics) : (recommendedTopics || '[]'),
        typeof transcript === 'object' ? JSON.stringify(transcript) : (transcript || '[]')
      ]
    );

    res.json({
      message: 'Mock interview session saved successfully!',
      interviewId: result.id,
      overallScore
    });
  } catch (err) {
    console.error('Save mock interview error:', err);
    res.status(500).json({ error: 'Failed to save mock interview.' });
  }
});

// GET /api/mock-interview/history
router.get('/history', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const history = await all(
      'SELECT * FROM mock_interviews WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const parsed = history.map(h => ({
      ...h,
      strengths: JSON.parse(h.strengths || '[]'),
      weak_areas: JSON.parse(h.weak_areas || '[]'),
      improvement_suggestions: JSON.parse(h.improvement_suggestions || '[]'),
      recommended_topics: JSON.parse(h.recommended_topics || '[]'),
      transcript: JSON.parse(h.transcript || '[]')
    }));

    res.json({ history: parsed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mock history.' });
  }
});

export default router;
