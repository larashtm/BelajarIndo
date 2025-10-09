// Minimal clean Express server (single copy)
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const flashcardRoutes = require('./routes/flashcard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcard', flashcardRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'BelajarIndo API is running', environment: process.env.NODE_ENV, port: PORT }));

app.get('/', (req, res) => res.json({ message: 'BelajarIndo API', version: '1.0.0' }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 BelajarIndo API Server');
  console.log('='.repeat(50));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});
// (duplicate blocks removed) file kept minimal above