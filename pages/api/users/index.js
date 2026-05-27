const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');
const bcrypt = require('bcryptjs');

function handler(req, res) {
  if (req.method === 'GET') {
    if (req.user.role !== 'master') return res.status(403).json({ error: 'Forbidden' });
    const users = db.prepare('SELECT id, name, email, role, active, created_at FROM users').all();
    return res.status(200).json(users);
  }
  if (req.method === 'POST') {
    if (req.user.role !== 'master') return res.status(403).json({ error: 'Forbidden' });
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields are required' });
    try {
      const hash = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(name, email, hash, role);
      return res.status(201).json({ id: result.lastInsertRowid, name, email, role });
    } catch (err) {
      if (err.message?.includes('UNIQUE')) return res.status(400).json({ error: 'Email already exists' });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
