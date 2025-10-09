const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'auth'));

const router = express.Router();
const prisma = new PrismaClient();

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    // Accept flexible payloads from frontend. Compute required numeric fields if missing.
    const { quizType, score = 0, totalQuestions: tq, correctAnswers: ca, questions = [], timeSpent: ts } = req.body;
    const userId = req.userId;

    // derive totals when possible
    const totalQuestions = Number.isInteger(tq) ? tq : (Array.isArray(questions) ? questions.length : 0);
    const correctAnswers = Number.isInteger(ca) ? ca : 0;
    const timeSpent = Number.isInteger(ts) ? ts : 0;

    const quizCategory = typeof quizType === 'string' && quizType.length > 0 ? quizType : 'unknown';

    const payload = {
      userId,
      quizCategory,
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 0,
      correctAnswers: Number(correctAnswers) || 0,
      timeSpent: Number(timeSpent) || 0,
    };

    const result = await prisma.quizResult.create({ data: payload });
    res.json({ success: true, result });
  } catch (error) {
    console.error('QUIZ SUBMIT ERROR:', error);
    const resp = { error: 'Failed to save quiz result' };
    if (process.env.NODE_ENV !== 'production') {
      resp.detail = error && error.message ? error.message : String(error);
      resp.stack = error && error.stack ? error.stack.split('\n').slice(0,5).join('\n') : undefined;
    }
    res.status(500).json(resp);
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const results = await prisma.quizResult.findMany({ where: { userId }, orderBy: { completedAt: 'desc' } });
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const results = await prisma.quizResult.findMany({ where: { userId } });
    const stats = { totalQuizzes: results.length, averageScore: results.length > 0 ? results.reduce((s, r) => s + r.score, 0) / results.length : 0, bestScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0, totalTimeSpent: results.reduce((s, r) => s + (r.timeSpent || 0), 0) };
    res.json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
