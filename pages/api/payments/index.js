const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  if (!['master', 'full', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'GET') {
    const payments = db.prepare('SELECT pay.*, p.name as project_name, c.name as client_name FROM payments pay JOIN projects p ON pay.project_id = p.id JOIN clients c ON pay.client_id = c.id ORDER BY pay.due_date DESC').all();
    return res.status(200).json(payments);
  }
  if (req.method === 'POST') {
    const { project_id, client_id, amount, status, due_date, notes } = req.body;
    if (!project_id || !client_id || !amount) return res.status(400).json({ error: 'Project ID, client ID and amount are required' });
    try {
      const result = db.prepare('INSERT INTO payments (project_id, client_id, amount, status, due_date, notes) VALUES (?, ?, ?, ?, ?, ?)').run(project_id, client_id, amount, status || 'pending', due_date, notes);
      return res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
