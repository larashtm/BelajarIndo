const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../server/utils/prisma');

module.exports = async (req, res) => {
  try {
    const body = req.body || (req.method === 'POST' ? JSON.parse(req.rawBody || '{}') : {});
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });

    // Return user (without password) and token — client will store token in localStorage
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Register function error:', err && (err.stack || err.message) ? (err.stack || err.message) : String(err));
    return res.status(500).json({ error: 'Server error', detail: err && err.message ? err.message : String(err) });
  }
};
