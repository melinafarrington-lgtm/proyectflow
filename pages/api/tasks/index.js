const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  if (req.method === 'GET') {
    let tasks;
    if (['master', 'full', 'admin'].includes(req.user.role)) {
      tasks = db.prepare('SELECT t.*, p.name as project_name, u.name as assigned_to_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id LEFT JOIN users u ON t.assigned_to = u.id ORDER BY t.created_at DESC').all();
    } else {
      tasks = db.prepare('SELECT t.*, p.name as project_name, u.name as assigned_to_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id LEFT JOIN users u ON t.assigned_to = u.id WHERE t.assigned_to = ? ORDER BY t.created_at DESC').all(req.user.id);
    }
    return res.status(200).json(tasks);
  }
  if (req.method === 'POST') {
    const { project_id, title, description, assigned_to, category } = req.body;
    if (!project_id || !title) return res.status(400).json({ error: 'Project ID and title are required' });
    try {
      const result = db.prepare('INSERT INTO tasks (project_id, title, description, assigned_to, category) VALUES (?, ?, ?, ?, ?)').run(project_id, title, description, assigned_to, category || 'general');
      return res.status(201).json({ id: result.lastInsertRowid, title });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
