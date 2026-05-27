const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const project = db.prepare('SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id WHERE p.id = ?').get(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const ts = db.prepare('SELECT SUM(hours) as total_hours FROM time_entries te JOIN tasks t ON te.task_id = t.id WHERE t.project_id = ?').get(id);
    project.actual_hours = ts.total_hours || 0;
    project.remaining_hours = (project.budget_hours || 0) - project.actual_hours;
    project.actual_cost = project.actual_hours * (project.hourly_rate || 0);
    project.tasks = db.prepare('SELECT t.*, u.name as assigned_to_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.project_id = ?').all(id);
    return res.status(200).json(project);
  }
  if (req.method === 'PUT') {
    if (!['master', 'full', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    const { name, client_id, description, budget_hours, hourly_rate, status } = req.body;
    try {
      const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      db.prepare('UPDATE projects SET name = ?, client_id = ?, description = ?, budget_hours = ?, hourly_rate = ?, status = ? WHERE id = ?').run(name || project.name, client_id || project.client_id, description !== undefined ? description : project.description, budget_hours !== undefined ? budget_hours : project.budget_hours, hourly_rate !== undefined ? hourly_rate : project.hourly_rate, status || project.status, id);
      return res.status(200).json({ message: 'Project updated' });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
