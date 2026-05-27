const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const task = db.prepare('SELECT t.*, p.name as project_name, u.name as assigned_to_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json(task);
  }
  if (req.method === 'PUT') {
    const { title, description, assigned_to, status, category } = req.body;
    try {
      const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      if (!['master', 'full', 'admin'].includes(req.user.role) && task.assigned_to !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      db.prepare('UPDATE tasks SET title = ?, description = ?, assigned_to = ?, status = ?, category = ? WHERE id = ?').run(title || task.title, description !== undefined ? description : task.description, assigned_to !== undefined ? assigned_to : task.assigned_to, status || task.status, category || task.category, id);
      return res.status(200).json({ message: 'Task updated' });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
