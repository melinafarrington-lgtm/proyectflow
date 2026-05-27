const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  if (req.method === 'GET') {
    let projects;
    if (['master', 'full', 'admin'].includes(req.user.role)) {
      projects = db.prepare('SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id ORDER BY p.created_at DESC').all();
    } else {
      projects = db.prepare('SELECT p.id, p.name, p.status, p.created_at, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id WHERE p.status = \'active\' ORDER BY p.created_at DESC').all();
    }
    return res.status(200).json(projects);
  }
  if (req.method === 'POST') {
    if (!['master', 'full', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    const { name, client_id, description, budget_hours, hourly_rate } = req.body;
    if (!name || !client_id) return res.status(400).json({ error: 'Name and client_id are required' });
    try {
      const result = db.prepare('INSERT INTO projects (name, client_id, description, budget_hours, hourly_rate) VALUES (?, ?, ?, ?, ?)').run(name, client_id, description, budget_hours || 0, hourly_rate || 0);
      return res.status(201).json({ id: result.lastInsertRowid, name });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
