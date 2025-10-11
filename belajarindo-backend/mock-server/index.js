import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post('/api/quiz/submit', (req, res) => {
  console.log('MOCK SERVER: Received /api/quiz/submit');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body));

  // Minimal validation similar to real server
  const { userId, totalQuestions, correctAnswers, score } = req.body || {};
  if (!userId) {
    return res.status(401).json({ error: 'No userId in payload (mock)' });
  }
  if (typeof totalQuestions !== 'number' || typeof correctAnswers !== 'number') {
    return res.status(400).json({ error: 'Missing numeric totalQuestions/correctAnswers (mock)' });
  }

  // Simulate DB created record
  const saved = {
    id: Math.floor(Math.random() * 1000000),
    userId,
    totalQuestions,
    correctAnswers,
    score: typeof score === 'number' ? score : Math.round((correctAnswers / totalQuestions) * 100),
    createdAt: new Date().toISOString()
  };

  return res.status(201).json({ success: true, data: saved });
});

app.listen(port, () => {
  console.log(`Mock server listening on http://localhost:${port}`);
});
