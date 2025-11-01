module.exports = async (req, res) => {
  // Defensive runtime require and environment checks so the serverless
  // function returns a helpful JSON error instead of crashing silently.
  try {
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    // Require prisma inside the handler and guard failures so Vercel
    // surfaces JSON with an actionable message instead of a 500 crash.
    let prisma;
    try {
      prisma = require('../../server/utils/prisma');
    } catch (e) {
      console.error('Prisma require failed in register function:', e && (e.stack || e.message) ? (e.stack || e.message) : String(e));
      return res.status(500).json({ error: 'Prisma client could not be loaded', detail: e && e.message ? e.message : String(e) });
    }

    if (!process.env.DATABASE_URL) {
      console.error('Missing DATABASE_URL environment variable in serverless environment');
      return res.status(500).json({ error: 'Missing DATABASE_URL in environment' });
    }

    const body = req.body || (req.method === 'POST' ? JSON.parse(req.rawBody || '{}') : {});
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Ensure we catch DB errors gracefully
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name, email, password: hashed } });

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });

      // Return user (without password) and token — client will store token in localStorage
      return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (dbErr) {
      console.error('Register DB error:', dbErr && (dbErr.stack || dbErr.message) ? (dbErr.stack || dbErr.message) : String(dbErr));
      return res.status(500).json({ error: 'Database error during registration', detail: dbErr && dbErr.message ? dbErr.message : String(dbErr) });
    }
  } catch (err) {
    console.error('Register function error (outer):', err && (err.stack || err.message) ? (err.stack || err.message) : String(err));
    return res.status(500).json({ error: 'Server error', detail: err && err.message ? err.message : String(err) });
  }
};
