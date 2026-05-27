const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  if (req.method === 'GET') {
    const clients = db.prepare('SELECT * FROM clients ORDER BY name ASC').all();
    return res.status(200).json(clients);
  }
  if (req.method === 'POST') {
    const { name, email, phone, company, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Client name is required' });
    try {
      const result = db.prepare('INSERT INTO clients (name, email, phone, company, notes) VALUES (?, ?, ?, ?, ?)').run(name, email, phone, company, notes);
      return res.status(201).json({ id: result.lastInsertRowid, name, email });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
