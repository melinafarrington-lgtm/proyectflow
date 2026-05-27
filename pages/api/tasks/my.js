const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  const tasks = db.prepare('SELECT t.*, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.assigned_to = ? ORDER BY t.created_at DESC').all(req.user.id);
  return res.status(200).json(tasks);
}
export default withAuth(handler);
