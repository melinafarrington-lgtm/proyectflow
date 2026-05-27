const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  if (req.method === 'GET') {
    let approvals;
    if (['master', 'full', 'admin'].includes(req.user.role)) {
      approvals = db.prepare('SELECT a.*, t.title as task_title, u.name as requester_name FROM approvals a JOIN tasks t ON a.task_id = t.id JOIN users u ON a.requested_by = u.id ORDER BY a.created_at DESC').all();
    } else {
      approvals = db.prepare('SELECT a.*, t.title as task_title, u.name as requester_name FROM approvals a JOIN tasks t ON a.task_id = t.id JOIN users u ON a.requested_by = u.id WHERE a.requested_by = ? ORDER BY a.created_at DESC').all(req.user.id);
    }
    return res.status(200).json(approvals);
  }
  if (req.method === 'POST') {
    const { task_id, notes } = req.body;
    if (!task_id) return res.status(400).json({ error: 'Task ID is required' });
    try {
      const result = db.prepare('INSERT INTO approvals (task_id, requested_by, notes) VALUES (?, ?, ?)').run(task_id, req.user.id, notes);
      db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('for_approval', task_id);
      return res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
