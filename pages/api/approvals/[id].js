const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'PUT') {
    if (!['master', 'full', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Status must be approved or rejected' });
    try {
      const approval = db.prepare('SELECT * FROM approvals WHERE id = ?').get(id);
      if (!approval) return res.status(404).json({ error: 'Approval request not found' });
      db.prepare('UPDATE approvals SET status = ?, notes = ?, approved_by = ? WHERE id = ?').run(status, notes || approval.notes, req.user.id, id);
      db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status === 'approved' ? 'approved' : 'pending', approval.task_id);
      return res.status(200).json({ message: 'Approval ' + status });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
