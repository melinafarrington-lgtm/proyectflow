const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  if (req.method === 'GET') {
    let entries;
    if (['master', 'full', 'admin'].includes(req.user.role)) {
      entries = db.prepare('SELECT te.*, t.title as task_title, u.name as user_name FROM time_entries te JOIN tasks t ON te.task_id = t.id JOIN users u ON te.user_id = u.id ORDER BY te.entry_date DESC').all();
    } else {
      entries = db.prepare('SELECT te.*, t.title as task_title, u.name as user_name FROM time_entries te JOIN tasks t ON te.task_id = t.id JOIN users u ON te.user_id = u.id WHERE te.user_id = ? ORDER BY te.entry_date DESC').all(req.user.id);
    }
    return res.status(200).json(entries);
  }
  if (req.method === 'POST') {
    const { task_id, hours, description, entry_date } = req.body;
    if (!task_id || !hours) return res.status(400).json({ error: 'Task ID and hours are required' });
    try {
      const result = db.prepare('INSERT INTO time_entries (task_id, user_id, hours, description, entry_date) VALUES (?, ?, ?, ?, ?)').run(task_id, req.user.id, hours, description, entry_date || new Date().toISOString().split('T')[0]);
      return res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
